import { connect } from 'react-redux';
import { get_index } from './gameLogic';

function *counter() {
    let i = 0;
    while (true) {
        yield i++;
    }
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


function Game(props) {
    const cols = props.width;
    const rows = props.height;
    const board = props.board;
    const winner = props.winner;

    return (
        <header className="App-header">
            <p>{winner ? `winner is ${winner}` : "keep clicking"}</p>
            <div className="game">
                <Board
                    cols={cols}
                    rows={rows}
                    board={board}
                    onClick={(x,y) => props.drop(x, y)}
                />
            </div>
        </header>
    );
}


function mapStateToProps(state) {
    return {
        width: state.width,
        height: state.height,
        board: state.board,
        winner: state.winner,
    };
}


function mapDispatchToProps(dispatch, ownProps) {
    return {
        drop: (x, y) => dispatch({type: "drop", payload: [x, y]}),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);