WIDTH = 7
HEIGHT = 6


def _square_index(x, y):
    return x * HEIGHT + y


def _drop_position(board, x, y):
    start = _square_index(x, y)

    if board[start] is not None:
        # occupied
        return None

    end = _square_index(x, HEIGHT - 1)
    for i in range(start, end + 1):
        if board[i] is not None:
            return i - 1

    return end


def _get_winner(board):
    def get_path_indices(x, y, next):
        while 0 <= x < WIDTH and 0 <= y < HEIGHT:
            yield _square_index(x, y)
            x, y = next(x, y)

    def get_paths():
        # vertical paths
        for x in range(WIDTH):
            yield get_path_indices(x, 0, lambda x, y: (x, y + 1))

        # horizontal paths
        for y in range(HEIGHT):
            yield get_path_indices(0, y, lambda x, y: (x + 1, y))

        # diagonal down paths
        for y in range(HEIGHT):
            yield get_path_indices(0, y, lambda x, y: (x + 1, y + 1))

        for x in range(1, WIDTH):
            yield get_path_indices(x, 0, lambda x, y: (x + 1, y + 1))

        # diagonal up paths
        for x in range(WIDTH):
            yield get_path_indices(x, HEIGHT - 1, lambda x, y: (x + 1, y - 1))

        for y in range(HEIGHT - 1):
            yield get_path_indices(0, y, lambda x, y: (x + 1, y - 1))

    def check_winner(path):
        player_x = 0
        player_o = 0

        for idx in path:
            match board[idx]:
                case "X":
                    player_x += 1
                    player_o = 0
                case "O":
                    player_x = 0
                    player_o += 1
                case None:
                    player_x = 0
                    player_o = 0

            if player_x >= 4:
                return "X"

            if player_o >= 4:
                return "O"

    for path in get_paths():
        winner = check_winner(path)
        if winner is not None:
            return winner

    # there are no winners
    return None


class Board:
    def __init__(self):
        self.squares = [None] * WIDTH * HEIGHT

    def drop(self, x, y, color):
        drop_pos = _drop_position(self.squares, x, y)
        valid_drop = drop_pos is not None

        if valid_drop:
            self.squares[drop_pos] = color

        return valid_drop

    def get_winner(self):
        return _get_winner(self.squares)
