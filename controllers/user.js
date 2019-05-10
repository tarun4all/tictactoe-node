const user = {
    add(params) {
        let result = {};
        if(users[params.username]) {
            let check = users[params.username];
            if (check['f'] && check['l']) {
                result.code = '3';
            } else if (!check['f']) {
                users[params.username].f = {val:0, turn:1, sid:params.sid};
                result.code = '1';
            } else if (!check['l']) {
                users[params.username].l = {val:1, turn:0, sid:params.sid};
                users[params.username].match = {0:'',1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:'', 8:''};
                result.code = '2';
                result.msg = `Lets start the match`;
                result.user = users[params.username];
                result.username = params.username;
            }
        } else {
            users[params.username] = {f:{val:0, turn:1, sid:params.sid}};
            result.code = '1';
        }
        return result;
    },

    remove(params) {
        
    }
}

module.exports = user;