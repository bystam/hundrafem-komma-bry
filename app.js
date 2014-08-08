var app, express, io, morgan, nib, port, sass, server, GoogleSpreadsheet, nodemailer, smtpTransport;
nodemailer = require('nodemailer');
smtpTransport = require('nodemailer-smtp-transport');
express = require('express');
app = express();
server = require("http").createServer(app);
io = require("socket.io").listen(server);
morgan = require('morgan');
sass = require('node-sass');
nib = require("nib");
GoogleSpreadsheet = require("google-spreadsheet");
google_auth = require('./auth')
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(morgan());
app.use(sass.middleware({
  src: __dirname + '/src/scss',
  dest: __dirname + '/public/',
  debug: true
}));
app.use(express["static"](__dirname + "/public"));
app.use(express.bodyParser());

app.get("/", function(req, res) {
  return res.render("freelancer", {
    title: "Radio"
  });
});

var sendMail = function (title, body, recipient){

  var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.nada.kth.se',
    port: 25,
    auth: {
        user: google_auth.nada_user,
        pass: google_auth.nada_password
    },
    maxConnections: 5,
    maxMessages: 10
  }));

  var mailOptions = {
      from: 'Titel<titel@d.kth.se>', // sender address
      to: recipient, // list of receivers
      subject: title, // Subject line
      text: body, // plaintext body
      html: body // html body
  };
  transporter.sendMail(mailOptions, function(error, info){});
}

var getConfirmationBody = function(name, alcohol, allergies){
  return "Hej "+name+"!"+
  "<p>Detta mail är en bekräftelse på att du nu är anmäld till Datasektionens "+
  "n0llegasque 2014! Betalningsinformation kommer via mail inom några dagar.</p> "+
  "<p>Dina anmälningsparametrar är: "+
  "<br>Alkohol: "+alcohol+
  "<br>Allergier: "+allergies+"</p>"+
  "<p>Kul att du kommer!</p> "+
  "<br>MVH Titel 2014";
}

var getReserveBody = function(name, alcohol, allergies){
  return "Hej "+name+"!"+
  "<p>Detta mail är en bekräftelse på att du nu är uppskriven på reservlistan för Datasektionens n0llegasque 2014</p>"+
  "<p>Dina anmälningsparametrar är: "+
  "<br>Alkohol: "+alcohol+
  "<br>Allergier: "+allergies+"</p>"+
  "<p>Kul att du kommer!</p> "+
  "<br>MVH Titel 2014";
}

app.post("/submit", function(req, res){
  var name = req.body.name;
  var email_adress = req.body.email;
  if(undefined == name || "" == name || undefined == email_adress || "" == email_adress)
    return res.render("failure", {title:"Misslyckades"});
  var alcohol = req.body.alcohol == undefined ? "nej" : "ja";
  var allergies = req.body.allergies;
  var google_form_key = google_auth.form_key;
  var sheet = new GoogleSpreadsheet(google_form_key);

  var reservelist = false;
  sheet.setAuth(google_auth.username, google_auth.password , function(err){
    sheet.getInfo( function( err, sheet_info ){
        sheet_info.worksheets[0].getRows( function( err, rows ){
          var GUEST_LIMIT = rows[0].guestlimit;
          if(rows.length > GUEST_LIMIT)
            reservelist = true;
          var sheetIndex = reservelist ? 2 : 1;
          sheet.addRow( sheetIndex, { namn:name, email:email_adress, allergier:allergies, alkohol:alcohol} );
          if(reservelist){
            sendMail ("Reservlistan för n0llegasquen 2014", getReserveBody (name, alcohol, allergies), email_adress);
            sheet_info.worksheets[1].getRows( function( err, reserve_rows ){
              if(reserve_rows.length < 2)
                sendMail("Reservlistan har börjat balla ur", "Guys, det är fler än 1 på reservlistan nuuuu", 'jensarv@gmail.com, fredrik.bystam@gmail.com')
            })
            return res.render("reserve", {title:"Anmäld som reserv!"});
          }
          sendMail ("Bekräftelse anmälan n0llegasquen 2014",getConfirmationBody(name, alcohol, allergies) , email_adress);
          return res.render("success", {title:"Anmäld!"});
        });
    });

  });

});

io.sockets.on("connection", function(socket) {
  return socket.on("to-server", function(data) {
    return io.sockets.emit("to-client", data);
  });
});

port = process.env.PORT || 5000;

server.listen(port, function() {
  return console.log("Listening on port: " + port);
});