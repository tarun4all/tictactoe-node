const winController = require("./winner");

const activity = {
    swap(turn, type, player) {
        let result = {};
        if(users[player]) {
            users[player].f.turn = !users[player].f.turn;
            users[player].l.turn = !users[player].l.turn;
    
            users[player].match[turn] = type;
            let gameWinner = winController.check(type, users[player].match);
            if (gameWinner.code == '2') {
                console.log(gameWinner);
                return {code : '2', win : gameWinner.winner};
            }
            result.code = '1';
            result.user = users[player];
        } else {
            result.code = '102';
        }
        return result;
    }
}

module.exports = activity;