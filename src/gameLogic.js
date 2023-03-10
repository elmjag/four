function get_index(x, y, height) {
    return x * height + y;
}


function dropPos(board, col, row, rows) {
    const start = get_index(col, row, rows);

    if (board[start] !== null) {
        return null;
    }

    const end = get_index(col, rows-1, rows);

    for (let i = start; i <= end; i += 1) {
        if (board[i] !== null) {
            return i - 1;
        }
    }

    return end;
}


function getWinner(board, width, height) {
    function *getPathIndices(x, y, next) {
        while (0 <= x && x < width && 0 <= y && y < height)
        {
            yield get_index(x, y, height);
            [x, y] = next(x, y);
        }
    }

    function *getPaths() {
        /* vertical paths */
        for (let x = 0; x < width; x += 1)
        {
            yield getPathIndices(
                x, 0,
                (x, y) => {return [x, y + 1]});
        }

        /* horizontal paths */
        for (let y = 0; y < height; y += 1)
        {
            yield getPathIndices(
                0, y,
                (x, y) => {return [x + 1, y]});
        }

        /* diagonal down paths */
        for (let y = 0; y < height; y += 1)
        {
            yield getPathIndices(
                0, y,
                (x, y) => {return [x + 1, y + 1]});
        }
        for (let x = 0; x < width; x += 1)
        {
            yield getPathIndices(
                x, 0,
                (x, y) => {return [x + 1, y + 1]});
        }

        /* diagonal up paths */
        for (let x = 0; x < width; x += 1)
        {
            yield getPathIndices(
                x, height - 1,
                (x, y) => {return [x + 1, y - 1]});
        }

        for (let y = 0; y < height; y += 1)
        {
            yield getPathIndices(
                0, y,
                (x, y) => {return [x + 1, y - 1]});

        }
    }

    function checkWinner(path) {
        let player1 = 0;
        let player2 = 0;

        for (const idx of path)
        {
            switch (board[idx])
            {
                case 'X':
                    player1 += 1;
                    player2 = 0;
                    break;
                case 'O':
                    player2 += 1;
                    player1 = 0;
                    break;
                default:
                    player1 = 0;
                    player2 = 0;
                    break;
            }
            if (player1 >= 4) {
                return 'X';
            }

            if (player2 >= 4) {
                return 'O';
            }

        }
        /* no winners */
        return null;
    }

    for (const path of getPaths())
    {
        let winner = checkWinner(path);
        if (winner)
        {
            return winner;
        }
    }
    return null;
}

export { get_index, dropPos, getWinner };