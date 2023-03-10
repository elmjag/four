import { createStore } from 'redux';
import { dropPos, getWinner } from './gameLogic';


const WIDTH = 7;
const HEIGHT = 6;


const initialState = {
    width: WIDTH,
    height: HEIGHT,
    board: Array(WIDTH * HEIGHT).fill(null),
    winner: null,
    nextPlayer: "X",
}


function handleDropAction(state, pos) {
    if (state.winner) {
        /* game over */
        return state;
    }

    const [x, y] = pos;

    const newPos = dropPos(state.board, x, y, state.height);
    if (newPos === null) {
        /* occupied, can't drop here */
        return state;
    }

    const newBoard = state.board.slice();
    newBoard[newPos] = state.nextPlayer;

    return {
        ...state,
        board: newBoard,
        nextPlayer: state.nextPlayer === "X" ? "O" : "X",
        winner: getWinner(newBoard, state.width, state.height),
    };
}


function reducer(state=initialState, action) {
    // eslint-disable-next-line default-case
    switch (action.type)
    {
        case 'drop':
            return handleDropAction(state, action.payload);
    }

    return state;
}

const store = createStore(reducer);

export { store };
