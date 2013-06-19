
include('/socket.io/socket.io.js')

var socket = io.connect('http://localhost');
socket.on('to-client', function (data) {
	var div = document.getElementById('chatframe').innerHTML += '<div class="message"><h3>Test</h3><p>' + data.toString() + '</p></div>';
});

function sendMessage() {
	var chatText = document.getElementById('submit-text');
	var text = chatText.value;
	chatText.value = '';
	socket.emit('to-server', { message: text});
}