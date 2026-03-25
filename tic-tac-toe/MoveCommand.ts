import { Board } from "./Board";
import { Player } from "./Player";

export class MoveCommand {
    row: number;
    col: number;
    player: Player;
    board: Board;

    constructor(board: Board, player: Player, row: number, col: number) {
        this.board = board;
        this.player = player;
        this.row = row;
        this.col = col;
    }

    execute() {
        this.board.placeSymbol(this.row, this.col, this.player.symbol);
    }

    undo() {
        this.board.clearCell(this.row, this.col);
    }
}
