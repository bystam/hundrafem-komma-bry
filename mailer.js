var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    auth = require('./auth');

exports.sendConfirmation = function (submission) {
  send (submission.recipient, 'Bekräftelse anmälan nØllegasquen 2014', getConfirmationBody (submission.name, submission.alcohol, submission.allergies));
}

exports.sendReserve = function (submission) {
  send (submission.recipient, 'Reservlistan för nØllegasquen 2014', getReserveBody (submission.name, submission.alcohol, submission.allergies));
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

var getConfirmationBody = function(name, alcohol, allergies){
  return "Hej "+name+"!"+
  "<p>Detta mail är en bekräftelse på att du nu är anmäld till Datasektionens "+
  "nØllegasque 2014! Betalningsinformation kommer via mail inom några dagar.</p> "+
  "<p>Dina anmälningsparametrar är: "+
  "<br>Alkohol: "+alcohol+
  "<br>Matpreferenser: "+allergies+"</p>"+
  "<p>Kul att du kommer!</p> "+
  "<br>MVH Titel 2014";
}

var getReserveBody = function(name, alcohol, allergies){
  return "Hej "+name+"!"+
  "<p>Detta mail är en bekräftelse på att du nu är uppskriven på reservlistan för Datasektionens nØllegasque 2014</p>"+
  "<p>Dina anmälningsparametrar är: "+
  "<br>Alkohol: "+alcohol+
  "<br>Matpreferenser: "+allergies+"</p>"+
  "<p>Kul att du kommer!</p> "+
  "<br>MVH Titel 2014";
}