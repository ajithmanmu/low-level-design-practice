export class Board {
    size: number;
    grid: string[][];

    constructor(size: number) {
        this.size = size;
        this.grid = [];
        for (let i = 0; i < size; i++) {
            this.grid.push(new Array(size).fill(""));
        }
    }

    placeSymbol(row: number, col: number, symbol: string) {
        this.grid[row][col] = symbol;
    }

    clearCell(row: number, col: number) {
        this.grid[row][col] = "";
    }

    isCellEmpty(row: number, col: number): boolean {
        return this.grid[row][col] === "";
    }

    isWithinBounds(row: number, col: number): boolean {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }

    isFull(): boolean {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === "") return false;
            }
        }
        return true;
    }

    print() {
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].map(cell => cell === "" ? "." : cell).join(" | ");
            console.log(`   ${row}`);
            if (i < this.size - 1) {
                console.log(`   ${"-".repeat(this.size * 4 - 3)}`);
            }
        }
    }
}
