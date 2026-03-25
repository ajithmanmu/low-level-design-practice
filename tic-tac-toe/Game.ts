import { Board } from "./Board";
import { Player } from "./Player";
import { MoveCommand } from "./MoveCommand";

export class Game {
    board: Board;
    players: Player[];
    currentPlayerIndex: number;
    undoStack: MoveCommand[];
    redoStack: MoveCommand[];
    status: string; // "IN_PROGRESS" | "WON" | "DRAW"
    winner: Player | null;

    constructor(players: Player[], boardSize: number = 3) {
        this.board = new Board(boardSize);
        this.players = players;
        this.currentPlayerIndex = 0;
        this.undoStack = [];
        this.redoStack = [];
        this.status = "IN_PROGRESS";
        this.winner = null;
    }

    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    makeMove(row: number, col: number) {
        if (this.status !== "IN_PROGRESS") return;
        if (!this.board.isWithinBounds(row, col)) return;
        if (!this.board.isCellEmpty(row, col)) return;

        const player = this.getCurrentPlayer();
        const command = new MoveCommand(this.board, player, row, col);
        command.execute();

        this.undoStack.push(command);
        this.redoStack = [];

        if (this.checkWin(row, col, player.symbol)) {
            this.status = "WON";
            this.winner = player;
            return;
        }

        if (this.board.isFull()) {
            this.status = "DRAW";
            return;
        }

        this.switchTurn();
    }

    undo() {
        if (this.undoStack.length === 0) return;

        // if the game was won/drawn, revert that state
        this.status = "IN_PROGRESS";
        this.winner = null;

        const command = this.undoStack.pop()!;
        command.undo();
        this.redoStack.push(command);

        this.switchTurn();
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const command = this.redoStack.pop()!;
        command.execute();
        this.undoStack.push(command);

        if (this.checkWin(command.row, command.col, command.player.symbol)) {
            this.status = "WON";
            this.winner = command.player;
            return;
        }

        if (this.board.isFull()) {
            this.status = "DRAW";
            return;
        }

        this.switchTurn();
    }

    private checkWin(row: number, col: number, symbol: string): boolean {
        const size = this.board.size;
        const grid = this.board.grid;

        // check row
        let rowWin = true;
        for (let j = 0; j < size; j++) {
            if (grid[row][j] !== symbol) { rowWin = false; break; }
        }
        if (rowWin) return true;

        // check column
        let colWin = true;
        for (let i = 0; i < size; i++) {
            if (grid[i][col] !== symbol) { colWin = false; break; }
        }
        if (colWin) return true;

        // check main diagonal
        let diagWin = true;
        for (let i = 0; i < size; i++) {
            if (grid[i][i] !== symbol) { diagWin = false; break; }
        }
        if (diagWin) return true;

        // check anti-diagonal
        let antiDiagWin = true;
        for (let i = 0; i < size; i++) {
            if (grid[i][size - 1 - i] !== symbol) { antiDiagWin = false; break; }
        }
        if (antiDiagWin) return true;

        return false;
    }

    private switchTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}
