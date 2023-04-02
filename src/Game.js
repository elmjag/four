import { connect } from 'react-redux';


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


function Game(props) {
    function message(state) {
        switch (state) {
            case "connecting":
               return "connecting to server";
            case "no_opponent":
                return "waiting for an opponent to connect";
            case "wait":
                return "opponent's turn";
            case "move":
                return "your move";
            case "won":
                return "your are the winner";
            case "lost":
                return "you have lost";
            case "server_busy":
                return "server busy, try later";
            default:
                console.assert(false);
        }
    }

    function our_color(color) {
        if (color === null) {
           return '';
        }
        return (<p>playing as {color}</p>);
    }

    return (
        <header className="App-header">
            {our_color(props.color)}
            <p>{message(props.state)}</p>
            <div className="game">
                <Board
                    cols={props.width}
                    rows={props.height}
                    board={props.board}
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
        state: state.state,
        color: state.color,
    };
}


function mapDispatchToProps(dispatch, ownProps) {
    return {
        drop: (x, y) => dispatch({type: "drop", payload: [x, y]}),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);