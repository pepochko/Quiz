const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Server is working on port 5000');
});

let players = 0;
let names = [];
let scores = [];

io.on('connection', function(socket) {
  socket.on('new player', function(name) {
    console.log(name + " joined the game");
    names.push(name);
    scores.push(0);
    players++;
    socket.broadcast.emit('login', players);
  });

  socket.on('score', function(player, score) {
    scores[names.indexOf(player)] = score;
    //socket.broadcast.emit('updateScore', scores);
  });
});

setInterval(function() {
  io.sockets.emit('scoreUpdate', scores, names);
}, 1000);