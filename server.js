const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve static files from the 'public' folder

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data); // Share drawing data
    });

    socket.on('clear', () => {
        io.emit('clear'); // Clear canvas for everyone
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
