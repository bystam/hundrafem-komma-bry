var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    nib = require("nib"),
    GoogleSpreadsheet = require("google-spreadsheet"),
    auth = require('./auth/auth'),
    mailer = require('./mailer');

app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(require('morgan')());
app.use(express["static"](__dirname + "/public"));
app.use(express.bodyParser ());

app.get("/", function(req, res) {
  return res.render("freelancer", {
    title: "nØllegasque"
  });
});

app.post('/submit', function (req, res) { 
  registerSubmission (req, res);
});

var registerSubmission = function (req, res) {
  console.log ("lolfi");
  var name = req.body.name;
  var email_adress = req.body.email;
  var alcohol = req.body.alcohol == undefined ? "nej" : "ja";
  var allergies = req.body.allergies;

  if (undefined === name || "" === name || undefined === email_adress || "" === email_adress)
    return res.render( "failure", { title: "Misslyckades" });

  var submission = { recipient: email_adress, name: name, alcohol: alcohol, allergies: allergies };
  addSubmissionToGoogleDocs (submission, res);
};

var ORDINARY = 1;
var RESERVE = 2;

var addSubmissionToGoogleDocs = function (submission, res) {
  var sheet = new GoogleSpreadsheet(auth.google_form_key);

  sheet.setAuth (auth.google_username, auth.google_password , function(err) {
    sheet.getInfo (function( err, sheet_info ) {
      sheet_info.worksheets[0].getRows (function( err, rows ) {
        var GUEST_LIMIT = rows[0].guestlimit;
        var submissionList = rows.length > GUEST_LIMIT ? RESERVE : ORDINARY;

        sheet.addRow( submissionList, 
                      { namn: submission.name, email: submission.recipient, allergier: submission.allergies, alkohol: submission.alcohol });

        if (submissionList === RESERVE) {
          notifyReserveSubmission (submission, sheet_info);
          return res.render("reserve", { title: "Anmäld som reserv!" });
        }

        mailer.sendConfirmation (submission);
        return res.render("success", { title: "Anmäld!" });
      });
    });
  });
};

var notifyReserveSubmission = function (submission, sheet_info) {
  mailer.sendReserve (submission);
  sheet_info.worksheets[1].getRows( function( err, reserve_rows ) {
    if(reserve_rows.length < 2)
      mailer.notifyTitelAboutReserveList ();
  })
};

port = process.env.PORT || 5000;
server.listen(port, function() {
  return console.log("Listening on port: " + port);
});