var app, express, io, morgan, nib, port, sass, server;
express = require('express');
app = express();
server = require("http").createServer(app);
io = require("socket.io").listen(server);
morgan = require('morgan');
sass = require('node-sass');
nib = require("nib");
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(morgan());
app.use(sass.middleware({
  src: __dirname + '/src/scss',
  dest: __dirname + '/public/',
  debug: true
}));
app.use(express["static"](__dirname + "/public"));

app.get("/", function(req, res) {
  return res.render("freelancer", {
    title: "Radio"
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