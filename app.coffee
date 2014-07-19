express = require("express")
app = express()
server = require("http").createServer(app)
io = require("socket.io").listen(server)
morgan = require 'morgan'

#stylus = require('stylus'),
nib = require("nib")


#
#// setup .styl to .css compilation
#function compile(str, path) {
#  return stylus(str)
#    .set('filename', path)
#    .use(nib())
#}
#

# express app configuring
app.set "views", __dirname + "/views"
app.set "view engine", "jade"
app.use morgan()

#
#app.use(stylus.middleware(
#	{ src: __dirname + '/public'
#	, compile: compile
#	}
#));
#
app.use express.static(__dirname + "/public")

# setup root route
app.get "/", (req, res) ->
  res.render "freelancer", title: "Radio"

# Heroku specific configuration
#io.configure ->
#  io.set "transports", ["xhr-polling"]
#  io.set "polling duration", 10

# setup socket.io echoing
io.sockets.on "connection", (socket) ->
  socket.on "to-server", (data) ->
    io.sockets.emit "to-client", data


# start server listening
port = process.env.PORT or 5000
server.listen port, ->
  console.log "Listening on port: " + port

