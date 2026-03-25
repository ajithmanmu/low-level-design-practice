# Tic Tac Toe - Low Level Design

## Problem Statement

Design a Tic Tac Toe game that:
- Supports an N x N grid (default 3x3)
- Two players take turns placing their symbol (X or O)
- Detects wins (row, column, diagonal) and draws
- Validates moves (occupied cells, out-of-bounds)
- Supports undo and redo of moves

---

## Key Pattern: Command Pattern

The undo/redo system uses the **Command Pattern** — each move is encapsulated as a command object that knows how to execute and undo itself.

| Operation | Stack Behavior |
|-----------|---------------|
| **Make Move** | Push to undoStack, clear redoStack |
| **Undo** | Pop from undoStack, push to redoStack |
| **Redo** | Pop from redoStack, push to undoStack |

---

## Class Design

### Player
Represents a player with a name and symbol.

**Properties:**
- `name: string` - Player name
- `symbol: string` - "X" or "O"

### Board
The N x N grid that holds cell state.

**Properties:**
- `size: number` - Board dimension
- `grid: string[][]` - 2D array ("" for empty)

**Methods:**
- `placeSymbol(row, col, symbol)` - Place a symbol on the grid
- `clearCell(row, col)` - Reset a cell to empty (used by undo)
- `isCellEmpty(row, col)` - Check if a cell is available
- `isWithinBounds(row, col)` - Validate row/col are within bounds
- `isFull()` - Check if all cells are filled (draw condition)
- `print()` - Display the board to console

### MoveCommand
Encapsulates a single move for undo/redo support.

**Properties:**
- `board: Board` - Reference to the board
- `player: Player` - Who made the move
- `row: number` - Row position
- `col: number` - Column position

**Methods:**
- `execute()` - Place the player's symbol on the board
- `undo()` - Clear the cell

### Game
Main orchestrator that manages turns, win detection, and game state.

**Properties:**
- `board: Board` - The game board
- `players: Player[]` - List of players
- `currentPlayerIndex: number` - Whose turn it is
- `undoStack: MoveCommand[]` - Past moves
- `redoStack: MoveCommand[]` - Undone moves
- `status: string` - "IN_PROGRESS", "WON", or "DRAW"
- `winner: Player | null` - The winning player

**Methods:**
- `getCurrentPlayer()` - Get the player whose turn it is
- `makeMove(row, col)` - Validate, execute, check win/draw, switch turn
- `undo()` - Undo the last move, revert game state
- `redo()` - Redo the last undone move, re-check win/draw

---

## Win Detection (Efficient)

Instead of scanning the entire board after each move, only check the **4 lines** that pass through the last move:

| Line | Condition | Check |
|------|-----------|-------|
| **Row** | Always | All cells in that row match |
| **Column** | Always | All cells in that column match |
| **Main Diagonal** | Always checked | `grid[i][i]` for all i |
| **Anti-Diagonal** | Always checked | `grid[i][size-1-i]` for all i |

**Complexity:** O(N) per move instead of O(N²).

---

## How to Run

```bash
npx ts-node test.ts
```

---

## Test Cases (13 tests)

| # | Test Case |
|---|-----------|
| 1 | Row win |
| 2 | Column win |
| 3 | Main diagonal win |
| 4 | Anti-diagonal win |
| 5 | Draw |
| 6 | Invalid move - occupied cell |
| 7 | Invalid move - out of bounds |
| 8 | No moves after game over |
| 9 | Undo last move |
| 10 | Undo a winning move |
| 11 | Redo after undo |
| 12 | Redo stack clears on new move |
| 13 | 4x4 board win |

---

## Files

```
tic-tac-toe/
├── Player.ts        # Player entity (name + symbol)
├── Board.ts         # N x N grid with cell operations
├── MoveCommand.ts   # Command pattern for undo/redo
├── Game.ts          # Main orchestrator
├── test.ts          # Test cases
├── tsconfig.json    # TypeScript config
└── README.md        # This file
```

---

## Key Design Decisions

### 1. Command Pattern for Undo/Redo
Each move is a MoveCommand object with execute() and undo(). Same pattern used in the Figma Document LLD, but simpler since there's only one command type.

### 2. Efficient Win Check
Only inspect the row, column, and diagonals affected by the last move. A win can only occur on a line that includes the most recent move.

### 3. Game State Management
Game tracks status explicitly ("IN_PROGRESS", "WON", "DRAW"). Moves are rejected once the game is over. Undo reverts the status back to "IN_PROGRESS".

### 4. Redo Stack Clears on New Move
Making a new move after an undo discards the redo history — same "new timeline" concept as the Figma Document LLD.

---

## Extension Ideas (Discuss in Interview)

### AI Opponent
Add a ComputerPlayer that uses minimax algorithm to pick optimal moves.

### Other Extensions
- Support more than 2 players with a larger board
- Tournament mode (best of N games)
- Move history with timestamps
- Observable pattern for UI updates
