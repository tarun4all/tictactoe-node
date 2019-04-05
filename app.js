var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;
var users = {};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('user', function (params) {
        console.log(params);
        var result = user(params);
        io.emit('turn', result ===2 ? 'lets match' : result);
        if (result === 2) { 
            socket.to(users[params.username].users[0].sid).emit('start', '1');
        }
        console.log(users['tarun'].users[0].sid);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});

function user(params) {
    let a = params.username;
    let found = Object.keys(users).indexOf(a);
    if (found >= 0) {
        let numOfUser = users[a].users.length;
        if (numOfUser >= 2) {
            return "user is busy";
        } else if (numOfUser === 0) {
            users[a].users[0] = {val:0, turn:1, sid: params.sid};
            return  "registered succesfully Waiting for next user";
        } else if (numOfUser === 1) {
            users[a].users[1] = { val: 1, turn: 0, sid: params.sid };
            return 2;
        }
    } else {
        users[a] = { users: [{ val: 0, turn: 1, sid:params.sid }] };
        return "registered succesfully Waiting for next user";
    }
}


function remove(username, a) {
    let found = users[username].users.findIndex(function (k) {
        return k.sid === a
    });
    if (found > -1) {
        found === 0 ? users[username].users.shift() : users[username].users.pop();
        return "user went offline";
    } else {
        return "something went wrong";
    }
}



http.listen(3000, function () {
    console.log('listening on *:3000');
});