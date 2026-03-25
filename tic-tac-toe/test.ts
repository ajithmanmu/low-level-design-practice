import { Game } from "./Game";
import { Player } from "./Player";

console.log("=== Tic Tac Toe Test ===\n");

// Test 1: Row Win
console.log("Test 1: Row Win (X wins top row)");
const p1 = new Player("Alice", "X");
const p2 = new Player("Bob", "O");
const game1 = new Game([p1, p2]);
game1.makeMove(0, 0); // X
game1.makeMove(1, 0); // O
game1.makeMove(0, 1); // X
game1.makeMove(1, 1); // O
game1.makeMove(0, 2); // X wins
console.log(`   Status: ${game1.status}, Winner: ${game1.winner?.name}`);
console.log(game1.status === "WON" && game1.winner === p1 ? "PASS\n" : "FAIL\n");

// Test 2: Column Win
console.log("Test 2: Column Win (O wins left column)");
const game2 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game2.makeMove(0, 1); // X
game2.makeMove(0, 0); // O
game2.makeMove(1, 1); // X
game2.makeMove(1, 0); // O
game2.makeMove(2, 2); // X
game2.makeMove(2, 0); // O wins
console.log(`   Status: ${game2.status}, Winner: ${game2.winner?.name}`);
console.log(game2.status === "WON" && game2.winner?.name === "Bob" ? "PASS\n" : "FAIL\n");

// Test 3: Diagonal Win
console.log("Test 3: Diagonal Win (X wins main diagonal)");
const game3 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game3.makeMove(0, 0); // X
game3.makeMove(0, 1); // O
game3.makeMove(1, 1); // X
game3.makeMove(0, 2); // O
game3.makeMove(2, 2); // X wins
console.log(`   Status: ${game3.status}, Winner: ${game3.winner?.name}`);
console.log(game3.status === "WON" && game3.winner?.name === "Alice" ? "PASS\n" : "FAIL\n");

// Test 4: Anti-Diagonal Win
console.log("Test 4: Anti-Diagonal Win (X wins anti-diagonal)");
const game4 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game4.makeMove(0, 2); // X
game4.makeMove(0, 0); // O
game4.makeMove(1, 1); // X
game4.makeMove(0, 1); // O
game4.makeMove(2, 0); // X wins
console.log(`   Status: ${game4.status}, Winner: ${game4.winner?.name}`);
console.log(game4.status === "WON" && game4.winner?.name === "Alice" ? "PASS\n" : "FAIL\n");

// Test 5: Draw
console.log("Test 5: Draw");
const game5 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game5.makeMove(0, 0); // X
game5.makeMove(0, 1); // O
game5.makeMove(0, 2); // X
game5.makeMove(1, 0); // O
game5.makeMove(1, 1); // X
game5.makeMove(2, 0); // O
game5.makeMove(1, 2); // X
game5.makeMove(2, 2); // O
game5.makeMove(2, 1); // X
console.log(`   Status: ${game5.status}`);
console.log(game5.status === "DRAW" ? "PASS\n" : "FAIL\n");

// Test 6: Invalid Move - Occupied Cell
console.log("Test 6: Invalid Move - Occupied Cell");
const game6 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game6.makeMove(0, 0); // X
game6.makeMove(0, 0); // O tries same cell - should be ignored
console.log(`   Current player: ${game6.getCurrentPlayer().name}`);
console.log(game6.getCurrentPlayer().name === "Bob" ? "PASS\n" : "FAIL\n");

// Test 7: Invalid Move - Out of Bounds
console.log("Test 7: Invalid Move - Out of Bounds");
const game7 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game7.makeMove(3, 3); // out of bounds - should be ignored
console.log(`   Current player: ${game7.getCurrentPlayer().name}`);
console.log(game7.getCurrentPlayer().name === "Alice" ? "PASS\n" : "FAIL\n");

// Test 8: No Moves After Game Over
console.log("Test 8: No Moves After Game Over");
const game8 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game8.makeMove(0, 0); // X
game8.makeMove(1, 0); // O
game8.makeMove(0, 1); // X
game8.makeMove(1, 1); // O
game8.makeMove(0, 2); // X wins
game8.makeMove(2, 2); // should be ignored
console.log(`   Cell (2,2) empty: ${game8.board.isCellEmpty(2, 2)}`);
console.log(game8.board.isCellEmpty(2, 2) ? "PASS\n" : "FAIL\n");

// Test 9: Undo
console.log("Test 9: Undo last move");
const game9 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game9.makeMove(0, 0); // X
game9.makeMove(1, 1); // O
game9.undo(); // undo O's move
console.log(`   Cell (1,1) empty: ${game9.board.isCellEmpty(1, 1)}`);
console.log(`   Current player: ${game9.getCurrentPlayer().name}`);
console.log(game9.board.isCellEmpty(1, 1) && game9.getCurrentPlayer().name === "Bob" ? "PASS\n" : "FAIL\n");

// Test 10: Undo a winning move
console.log("Test 10: Undo a winning move");
const game10 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game10.makeMove(0, 0); // X
game10.makeMove(1, 0); // O
game10.makeMove(0, 1); // X
game10.makeMove(1, 1); // O
game10.makeMove(0, 2); // X wins
game10.undo(); // undo winning move
console.log(`   Status: ${game10.status}, Winner: ${game10.winner}`);
console.log(game10.status === "IN_PROGRESS" && game10.winner === null ? "PASS\n" : "FAIL\n");

// Test 11: Redo
console.log("Test 11: Redo after undo");
const game11 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game11.makeMove(0, 0); // X
game11.makeMove(1, 1); // O
game11.undo(); // undo O's move
game11.redo(); // redo O's move
console.log(`   Cell (1,1): ${game11.board.grid[1][1]}`);
console.log(`   Current player: ${game11.getCurrentPlayer().name}`);
console.log(game11.board.grid[1][1] === "O" && game11.getCurrentPlayer().name === "Alice" ? "PASS\n" : "FAIL\n");

// Test 12: Redo clears on new move
console.log("Test 12: Redo stack clears on new move");
const game12 = new Game([new Player("Alice", "X"), new Player("Bob", "O")]);
game12.makeMove(0, 0); // X
game12.makeMove(1, 1); // O
game12.undo(); // undo O's move
game12.makeMove(2, 2); // O makes a different move - redo stack should clear
game12.redo(); // should do nothing
console.log(`   Cell (1,1) empty: ${game12.board.isCellEmpty(1, 1)}`);
console.log(game12.board.isCellEmpty(1, 1) ? "PASS\n" : "FAIL\n");

// Test 13: 4x4 Board
console.log("Test 13: 4x4 Board Win");
const game13 = new Game([new Player("Alice", "X"), new Player("Bob", "O")], 4);
game13.makeMove(0, 0); // X
game13.makeMove(1, 0); // O
game13.makeMove(0, 1); // X
game13.makeMove(1, 1); // O
game13.makeMove(0, 2); // X
game13.makeMove(1, 2); // O
game13.makeMove(0, 3); // X wins top row
console.log(`   Status: ${game13.status}, Winner: ${game13.winner?.name}`);
console.log(game13.status === "WON" && game13.winner?.name === "Alice" ? "PASS\n" : "FAIL\n");
