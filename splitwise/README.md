# Splitwise - Low Level Design

## Problem Statement

Design a bill-splitting application that:
- Allows users to create groups and add members
- Supports adding expenses with different split types (equal, exact, percentage)
- Tracks balances between users (who owes whom)
- Allows users to settle up and record payments
- Maintains transaction history

---

## Key Pattern: Strategy Pattern

The split calculation uses the **Strategy Pattern** — different split types implement the same interface but calculate amounts differently.

### Split Types

| Type | Description | Example |
|------|-------------|---------|
| **EqualSplit** | Divide equally among all members | $90 ÷ 3 = $30 each |
| **ExactSplit** | Specify exact amount per person | Bob: $60, Charlie: $40 |
| **PercentSplit** | Specify percentage per person | Bob: 50%, Charlie: 30%, Alice: 20% |

---

## Class Design

### User
Represents a user with balance tracking.

**Properties:**
- `id: string` - Unique identifier
- `name: string` - User name
- `balances: Map<userId, amount>` - Balance with each user (+ receive, - give)

**Methods:**
- `updateBalance(userId, amount)` - Update balance with another user
- `getBalance(userId)` - Get current balance with another user

### Group
Contains members and their shared expenses.

**Properties:**
- `id: string`
- `name: string`
- `members: User[]`
- `expenses: Expense[]`

### Expense
Records a shared expense.

**Properties:**
- `id: string`
- `amount: number`
- `group: Group`
- `paidBy: User`
- `description: string`
- `splits: Split[]`
- `date: number`

### Split (Interface)
Base interface for split strategies.

**Properties:**
- `user: User` - Who this split applies to

**Methods:**
- `getAmount()` - Calculate the split amount

### EqualSplit, ExactSplit, PercentSplit
Concrete implementations of Split interface.

### Transaction
Records a payment between users.

**Properties:**
- `id: string`
- `from: User`
- `to: User`
- `amount: number`
- `date: number`

### SplitWiseService
Main orchestrator (Singleton-style service).

**Methods:**
- `addUser(name)` - Create a user
- `createGroup(name)` - Create a group
- `addMemberToGroup(memberId, groupId)` - Add user to group
- `addExpense(groupId, paidByUserId, amount, description, splitType, splitDetails)` - Add expense
- `getBalances(userId)` - Get all balances for a user
- `settleUp(fromUserId, toUserId, amount)` - Record a payment

---

## Balance Convention

| Balance Value | Meaning |
|---------------|---------|
| **Positive** | I owe them (I need to give) |
| **Negative** | They owe me (I will receive) |

**Example:** If `Alice.balances[Bob] = -50`, Alice is owed $50 by Bob.

---

## How to Run

```bash
npx ts-node test.ts
```

---

## Test Cases (14 tests)

| # | Test Case |
|---|-----------|
| 1 | Create users |
| 2 | Create group |
| 3 | Add members to group |
| 4 | Equal split - 2 people |
| 5 | Equal split - 3 people |
| 6 | Exact split |
| 7 | Percentage split |
| 8 | Settle up - partial payment |
| 9 | Settle up - full payment |
| 10 | Transaction history recorded |
| 11 | Multiple expenses accumulate |
| 12 | getBalances returns full map |
| 13 | Error - user not found |
| 14 | Error - group not found |

---

## Files

```
splitwise/
├── User.ts              # User entity with balance tracking
├── Group.ts             # Group entity
├── Expense.ts           # Expense entity
├── Split.ts             # Split interface
├── EqualSplit.ts        # Equal split strategy
├── ExactSplit.ts        # Exact split strategy
├── PercentSplit.ts      # Percentage split strategy
├── Transaction.ts       # Payment transaction entity
├── SplitWiseService.ts  # Main orchestrator
├── test.ts              # Test cases
├── tsconfig.json        # TypeScript config
└── README.md            # This file
```

---

## Key Design Decisions

### 1. Strategy Pattern for Splits
Each split type is its own class implementing the Split interface. Easy to add new split types (e.g., ShareSplit for unequal shares).

### 2. Per-User Balance Map
Each user tracks their balance with every other user. Simple O(1) lookup. Alternative would be a central BalanceSheet, but per-user is more intuitive.

### 3. Balances Are Bidirectional
When A owes B $50:
- `A.balances[B] = 50` (A owes B)
- `B.balances[A] = -50` (B is owed by A)

This ensures consistency and makes settleUp straightforward.

### 4. Transactions Stored in Service
Transactions are stored centrally in SplitwiseService, not duplicated in each User. Avoids data redundancy.

---

## Extension Ideas (Discuss in Interview)

### Debt Simplification
Minimize number of transactions to settle all debts:
1. Calculate net balance per user (sum of all balances)
2. Separate into debtors (negative) and creditors (positive)
3. Greedily match largest debtor with largest creditor

### Other Extensions
- Cross-group balance aggregation
- Recurring expenses
- Multi-currency support
- Expense categories and reports
