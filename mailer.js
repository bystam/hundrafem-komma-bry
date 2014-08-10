var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    auth = require('./auth');

exports.sendConfirmation = function (submission) {
  send (submission.recipient, 'Bekräftelse anmälan nØllegasquen 2014', getConfirmationBody (submission));
}

exports.sendReserve = function (submission) {
  send (submission.recipient, 'Reservlistan för nØllegasquen 2014', getReserveBody (submission));
}

exports.notifyTitelAboutReserveList = function () {
  send ('jensarv@gmail.com, fredrik.bystam@gmail.com', "Reservlistan har börjat balla ur", "Guys, det är fler än 1 på reservlistan nuuuu")
}

var send = function (recipient, title, body) {

  var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.nada.kth.se',
    port: 25,
    auth: {
        user: auth.nada_user,
        pass: auth.nada_password
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

  transporter.sendMail(mailOptions, function(error, info) { }); // TODO handle this error?
}

var getConfirmationBody = function(submission){
  return "Hej "+submission.name+"!"+
  "<p>Detta mail är en bekräftelse på att du nu är anmäld till Datasektionens "+
  "nØllegasque 2014! Betalningsinformation kommer via mail inom några dagar.</p> "+
  getSubmissionParameterList(submission) +
  "<p>Kul att du kommer!</p> "+
  "<br>MVH Titel 2014";
}

var getReserveBody = function(submission){
  return "Hej "+submission.name+"!"+
  "<p>Detta mail är en bekräftelse på att du nu är uppskriven på reservlistan för Datasektionens nØllegasque 2014</p>"+
  getSubmissionParameterList(submission) +
  "<p>Kul att du kommer!</p> "+
  "<br>MVH Titel 2014";
}

var getSubmissionParameterList = function(submission){
  return "<p>Dina anmälningsparametrar är: "+
  "<br>Alkohol: "+submission.alcohol +
  "<br>Vegetarian: " +submission.vegetarian +
  "<br>Vegan: " + submission.vegan +
  "<br>Laktos: " + submission.laktos +
  "<br>Gluten: " + submission.gluten +
  "<br>Skaldjursallergiker: " + submission.skaldjur +
  "<br>Övriga matpreferenser: " + submission.misc + "</p>";
}