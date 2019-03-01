const fs = require('fs');
const path = require('path');
const http = require('http').createServer(onRequest);
const io = require('socket.io')(http);


const port = process.env.PORT || 3000;

function onRequest(req, res) {
    const filePath = path.join(__dirname, '/static/index.html');
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log('chat message: ' + msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});