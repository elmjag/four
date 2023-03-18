import { createStore, applyMiddleware } from 'redux';
import { socket } from './socket.js';


const WIDTH = 7;
const HEIGHT = 6;


const initialState = {
    width: WIDTH,
    height: HEIGHT,
    board: Array(WIDTH * HEIGHT).fill(null),
    state: "connecting",
}


function handleUpdateAction(state, data)
{
    return {
        ...state,
        board: data.board,
        state: data.state,
    }
}


function reducer(state=initialState, action) {
    // eslint-disable-next-line default-case
    switch (action.type)
    {
        case 'update':
            return handleUpdateAction(state, action.payload);
    }

    return state;
}


function socketioMiddleware({dispatch}) {
    function handleDrop([x, y]) {
        socket.emit("message", x, y);
    }

    socket.on("message", (data) => {
        dispatch({type: "update", payload: data});
    });

    return next => action => {
        if (action.type === "drop") {
            handleDrop(action.payload);
            return;
        }

        return next(action);
    };
}


const store = createStore(reducer, initialState, applyMiddleware(...[socketioMiddleware]));


export { store };
