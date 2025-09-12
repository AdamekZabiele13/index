const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let userCount = 1;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // Assign a username
  const username = 'user' + String(userCount).padStart(5, '0');
  userCount++;
  socket.emit('username', username);

  socket.on('message', (msg) => {
    // Broadcast message to all except sender
    io.emit('message', { username, text: msg });
  });

  socket.on('disconnect', () => {
    // Nothing needed for simplicity
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});