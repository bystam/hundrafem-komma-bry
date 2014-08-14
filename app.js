var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    nib = require("nib"),
    GoogleSpreadsheet = require("google-spreadsheet"),
    auth = require('./auth'),
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
  var submission = {};
  submission.name = req.body.name;
  submission.personnummer = req.body.personnummer;
  submission.phone = req.body.phone;
  submission.recipient = req.body.email;
  submission.alcohol = req.body.alcohol == undefined ? "nej" : "ja";
  submission.vegetarian = req.body.vegetarian == undefined ? "nej" : "ja";
  submission.vegan = req.body.vegan == undefined ? "nej" : "ja";
  submission.laktos = req.body.laktos == undefined ? "nej" : "ja";
  submission.gluten = req.body.gluten == undefined ? "nej" : "ja";
  submission.skaldjur = req.body.skaldjur == undefined ? "nej" : "ja";
  submission.misc = req.body.misc;

  if (undefined === submission.name || "" === submission.name || undefined === submission.recipient || "" === submission.recipient)
    return res.render( "failure", { title: "Misslyckades" });

  addSubmissionToGoogleDocs (submission, res);
};

var ORDINARY = 1;
var RESERVE = 2;

var addSubmissionToGoogleDocs = function (submission, res) {
  var sheet = new GoogleSpreadsheet(auth.form_key);

  sheet.setAuth (auth.username, auth.password , function(err) {
    sheet.getInfo (function(err, sheet_info ) {
      sheet_info.worksheets[0].getRows (function( err, rows ) {
        var GUEST_LIMIT = rows[0].guestlimit;
        var submissionList = rows.length > GUEST_LIMIT ? RESERVE : ORDINARY;

        sheet.addRow( submissionList, 
                      { namn: submission.name, 
                        personnummer: submission.personnummer,
                        email: submission.recipient, 
                        telefonnummer: submission.phone,
                        alkohol: submission.alcohol,
                        vegetarian: submission.vegetarian,
                        vegan: submission.vegan,
                        laktos: submission.laktos,
                        gluten: submission.gluten,
                        skaldjur: submission.skaldjur,
                        matpreferenser: submission.misc
                      });

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