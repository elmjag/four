import './App.css';
import { useState } from 'react';


function *counter() {
    let i = 0;
    while (true) {
        yield i++;
    }
}


function get_index(x, y, height) {
    return x * height + y;
}


function Board(props) {

    function squares(cntr, row) {
        let content = [];
        for (let col = 0; col < props.cols; col += 1)
        {
            content.push(
                <button
                    key={cntr.next().value}
                    className="square"
                    onClick={() => props.onClick(col, row)}
                >
                    {props.board[get_index(col, row, props.rows)]}
                </button>
            );
        }

        return content;
    }

    function oneRow(cntr, row) {
        return (
            <div key={cntr.next().value} className="game-row">
                {squares(cntr, row)}
            </div>
        );
   }

    function rows(cntr) {
        let content = [];

        for (let i = 0; i < props.rows; i += 1)
        {
            content.push(oneRow(cntr, i));
        }

        return content;
   }

    return (
        <div className="game-board">
            {rows(counter())}
        </div>
    );
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


function Game(props) {
    const cols = parseInt(props.cols);
    const rows = parseInt(props.rows);

    const [board, setBoard] = useState(Array(cols*rows).fill(null));
    const [winner, setWinner] = useState(null);
    const [nextPlayer, setNextPlayer] = useState("X");

    function dropPos(col, row) {
        const start = get_index(col, row, rows);

        if (board[start] !== null)
        {
            return null;
        }

        const end = get_index(col, rows-1, rows);

        for (let i = start; i <= end; i += 1)
        {
            if (board[i] !== null) {
                return i - 1;
            }
        }

        return end;
    }

    function handleClick(col, row)
    {
        if (winner) {
            /* game over */
            return;
        }

        const newPos = dropPos(col, row);

        if (newPos === null) {
            /* occupied, can't drop here */
            return;
        }

        const newBoard = board.slice();
        newBoard[newPos] = nextPlayer;

        setBoard(newBoard);
        setWinner(getWinner(newBoard, cols, rows));
        setNextPlayer(nextPlayer === "X" ? "O" : "X");
    }

    return (
        <header className="App-header">
            <p>{winner ? `winner is ${winner}` : "keep clicking"}</p>
            <div className="game">
                <Board
                    cols={cols}
                    rows={rows}
                    board={board}
                    onClick={handleClick}
                />
            </div>
        </header>
    );
}


function App() {

    return (
        <div className="App">
            <Game cols="7" rows="6"/>
        </div>
    );
}

export default App;
