const express = require("express");
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var glob = require('./config/global');

//loading controller's function
const usersController = require("./controllers/user");
const gameController = require("./controllers/gameActivity");

app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    //users connection
    socket.on('room', function(room) {
        console.log('here',room);
        if (room) {
            let params = {username : room.username, sid : room.sid};
            let result = usersController.add(params);
            console.log(result);
            if (result.code == '2') {
                socket.join(room.username);
                io.sockets.in(room.username).emit('turn', result);
            } else if (result.code == '1') {
                socket.join(room.username);
                socket.emit('turn', {code : 101, msg : `Waiting for oponent` });
            } else if (result.code == '3') {
                socket.emit('turn', {code : 102, msg : `Username is busy in another match` });
            }
        } else {
            socket.emit('turn', {code : 102, msg : `Username can't be blank` });
        }
    });

    socket.on('match', function(params) {
        console.log(params);
        if (typeof params == 'object' && Object.keys(params).length > 0) {
            if (params.turn && params.type && params.player) {
                let result = gameController.swap(params.turn, params.type, params.player);
                if (result.code == '1') {
                    io.sockets.in(params.player).emit('game', result);
                } else if (result.code == '2') {
                    console.log(result);
                    io.sockets.in(params.player).emit('game', {code : '2', msg : `${result.win} won` });
                } else if (result.code == '102') {
                    socket.emit('game', {code : 102, msg : `invalid params` });
                }
            } else {
                socket.emit('game', {code : 102, msg : `invalid params` });
            }
        } else {
            socket.emit('game', {code : 102, msg : `invalid params` });
        }
    });
});

  
http.listen(3011, function(){
    console.log('listening on *:3011');
});