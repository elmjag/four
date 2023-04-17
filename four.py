#!/usr/bin/env python
from dataclasses import dataclass
from enum import Enum, auto
from aiohttp import web
import socketio
from board import Board


sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)


@dataclass
class Game:
    player_x = None
    player_o = None
    board = None

    turn = None
    winner = None
    winning_path = []

    def __init__(self):
        self.board = Board()

    def _current_color(self):
        if self.player_x == self.turn:
            return "X"
        return "O"

    def drop(self, x, y):
        color = self._current_color()

        if self.board.drop(x, y, color):
            # toggle turn
            self.turn = self.player_x if color == "O" else self.player_o
            # check if some player have won
            self.winner, self.winning_path = self.board.get_winner()


game = Game()


async def send_update(sid):
    def our_color():
        if sid == game.player_x:
            return "X"
        return "O"

    def get_state():
        if game.player_o is None:
            return "no_opponent"

        if game.winner:
            if game.winner == color:
                return "won"
            return "lost"

        if game.turn == sid:
            # our turn
            return "move"
        return "wait"

    color = our_color()

    payload = dict(
        board=game.board.squares,
        marked_path = game.winning_path,
        state=get_state(),
        color=color,
    )

    await sio.send(data=payload, room=sid)


async def send_updates():
    await send_update(game.player_x)
    await send_update(game.player_o)


@sio.event
async def connect(sid, _):
    print(f"new connection {sid=}")
    if game.player_x is None:
        game.player_x = sid
        await send_update(game.player_x)
        return

    if game.player_o is None:
        game.player_o = sid
        game.turn = game.player_x
        await send_updates()
        return

    # 'third' connection
    await sio.send(data="server_busy", room=sid)


@sio.event
async def message(sid, x, y):
    if sid != game.turn:
        print(f"ignoring message from {sid=}")
        return

    if game.winner is not None:
        print("game over, ignoring message")
        return

    game.drop(x, y)

    await send_updates()


async def restart_game(disconnected_sid):
    global game

    if game.player_x == disconnected_sid:
        # player X disconnected
        remaining_sid = game.player_o
    elif game.player_o == disconnected_sid:
        # player O disconnected
        remaining_sid = game.player_x
    else:
        # third connection disconnected,
        # we are done here
        return

    # reset game state
    game = Game()

    if remaining_sid is None:
        # no player remain connected,
        # we are done here
        return

    # 'reconnect' remaining player
    await connect(remaining_sid, None)


@sio.event
async def disconnect(sid):
    print("disconnect ", sid)
    await restart_game(sid)


async def index(request):
    with open("build/index.html") as f:
        return web.Response(text=f.read(), content_type="text/html")


app.router.add_get("/", index)
app.router.add_static("/", "build")

if __name__ == "__main__":
    web.run_app(app)
