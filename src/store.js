import { createStore, applyMiddleware } from 'redux';
import { socket } from './socket.js';


const WIDTH = 7;
const HEIGHT = 6;


const initialState = {
    width: WIDTH,
    height: HEIGHT,
    board: Array(WIDTH * HEIGHT).fill(null),
    marked_path: [],
    state: "connecting",
    color: null,
}


function handleUpdateAction(state, data)
{
    return {
        ...state,
        board: data.board,
        marked_path: data.marked_path,
        state: data.state,
        color: data.color,
    }
}


function reducer(state=initialState, action) {
    // eslint-disable-next-line default-case
    switch (action.type)
    {
        case 'server_busy':
            return {
                ...state,
                state: "server_busy",
            };
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
        if (data === "server_busy") {
            dispatch({type: "server_busy"});
            return;
        }
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
