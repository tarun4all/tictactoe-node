const winner = {
    check(type, match) {
        let squares = [];
        let result = {code : 0, winner : ''};
        var winCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        Object.keys(match).forEach((val,idx) => {
            squares.push(match[val] ? match[val] : idx);
        });

        for(var i = 0; i < winCombinations.length; i++)
        {
            if(squares[winCombinations[i][0]] == type && squares[winCombinations[i][1]] == type && squares[winCombinations[i][2]] == type)
            {
                result.winner = type;
                result.code = 2;
            }
        }

        return result;
    }
}

module.exports = winner;