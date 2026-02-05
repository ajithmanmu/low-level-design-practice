# ATM Machine - Low Level Design

## Problem Statement

Design an ATM System that:
- Authenticates users via card number and PIN
- Allows balance inquiry, cash withdrawal, and cash deposit
- Dispenses cash using a greedy algorithm across available denominations
- Locks card after 3 failed PIN attempts
- Rolls back bank transactions if cash dispensing fails

---

## Key Patterns

### 1. State Pattern
The ATM uses the **State Pattern** because operations behave differently depending on the machine's current state.

### 2. Greedy Algorithm
Cash dispensing uses a greedy approach — dispense largest denominations first.

---

## States

| State | Description | Valid Operations |
|-------|-------------|------------------|
| **IdleState** | Waiting for card | insertCard |
| **CardInsertedState** | Card in, waiting for PIN | enterPin, ejectCard |
| **AuthenticatedState** | PIN verified, session active | withdraw, deposit, getBalance, ejectCard |

### State Diagram

```
┌─────────────┐
│  IdleState  │ ← ejectCard()
└─────┬───────┘
      │ insertCard()
      ▼
┌─────────────────────┐
│  CardInsertedState  │ ← wrong PIN (retry)
└─────┬───────────────┘
      │ enterPin() ✓
      ▼
┌─────────────────────┐
│  AuthenticatedState │ ←──┐
└─────────────────────┘    │
      │ withdraw()         │ (stay in same state)
      │ deposit()          │
      │ getBalance()  ─────┘
      │
      │ ejectCard()
      ▼
┌─────────────┐
│  IdleState  │
└─────────────┘
```

---

## Class Design

### State (Interface)
Defines the contract for all states.

**Methods:**
- `insertCard(atm, cardNumber)` → Handle card insertion
- `enterPin(atm, pin)` → Handle PIN entry
- `withdraw(atm, accountId, amount)` → Handle withdrawal
- `deposit(atm, accountId, amount)` → Handle deposit
- `getBalance(atm, accountId)` → Handle balance inquiry
- `ejectCard(atm)` → Handle card ejection

### ATMSystem (Context)
Holds state and delegates operations to current state.

**Properties:**
- `currentBalance: number` - Total cash in the ATM
- `denominations: Map<number, number>` - Available notes (denomination → count)
- `state: State` - Current state
- `insertedCard: string` - Currently inserted card number
- `bank: Bank` - Bank service reference

**Methods:**
- `insertCard(cardNumber)` → Delegates to state
- `enterPin(pin)` → Delegates to state
- `withdraw(accountId, amount)` → Delegates to state
- `deposit(accountId, amount)` → Delegates to state
- `getBalance(accountId)` → Delegates to state
- `ejectCard()` → Delegates to state
- `calculate(amount)` → Greedy algorithm for cash dispensing

### Bank
Manages accounts and processes transactions.

**Methods:**
- `authenticate(pin, cardNumber)` → Returns SUCCESS, FAILURE, or MAX_ATTEMPTS_EXCEEDED
- `deposit(accountId, amount)` → Credits account
- `withdraw(accountId, amount)` → Debits account
- `getBalance(accountId)` → Returns balance

### Account
Represents a bank account.

**Properties:**
- `accountId: string`
- `balance: number`
- `transactions: Transaction[]`

### Card
Represents an ATM card.

**Properties:**
- `cardNumber: number`
- `account: Account`
- `attempts: number` - Failed PIN counter
- `pin: number`

### Transaction
Records a financial operation.

**Properties:**
- `transactionId: number`
- `type: Status (DEPOSIT | WITHDRAW | TRANSFER)`
- `account: Account`
- `amount: number`
- `timestamp: Date`

---

## Cash Dispensing (Greedy Algorithm)

```typescript
calculate(amount) {
    // 1. Sort denominations largest to smallest
    // 2. For each denomination:
    //    - Use as many as possible while denom <= remaining and count > 0
    // 3. Track updates but don't mutate until success
    // 4. If remaining > 0, throw error (can't make exact amount)
    // 5. Apply updates to denomination map and reduce currentBalance
}
```

**Example:**
- Withdraw $270 with denominations [100, 50, 20, 10]
- Result: [100, 100, 50, 20]

---

## Withdrawal Flow (with Rollback)

```
1. Check ATM has enough total cash (currentBalance >= amount)
2. Call bank.withdraw() to debit account
3. Try calculate() to dispense cash
4. If dispense fails (can't make exact change):
   → Call bank.deposit() to rollback account debit
   → Throw error
```

---

## How to Run

```bash
npx ts-node test.ts
```

---

## Test Cases (17 tests)

| # | Test Case |
|---|-----------|
| 1 | Initial state is IdleState |
| 2 | Insert card transitions to CardInsertedState |
| 3 | Correct PIN transitions to AuthenticatedState |
| 4 | Wrong PIN stays in CardInsertedState |
| 5 | 3 wrong PINs locks card, 4th attempt ejects to IdleState |
| 6 | Check balance |
| 7 | Withdraw happy path (greedy dispensing) |
| 8 | Deposit |
| 9 | Eject card transitions to IdleState |
| 10 | Cannot enter PIN in IdleState |
| 11 | Cannot withdraw in CardInsertedState |
| 12 | Cannot insert card when card already inserted |
| 13 | Insufficient account balance |
| 14 | ATM insufficient cash |
| 15 | Cannot dispense exact amount, bank withdrawal rolled back |
| 16 | Multiple operations in one authenticated session |
| 17 | Denomination map updates correctly |

---

## Files

```
atm-machine/
├── State.ts               # State interface
├── IdleState.ts           # Idle state implementation
├── CardInsertedState.ts   # Card inserted state implementation
├── AuthenticatedState.ts  # Authenticated state implementation
├── ATMSystem.ts           # Context class + cash dispensing
├── Bank.ts                # Banking service
├── Account.ts             # Account entity
├── Card.ts                # Card entity
├── Transaction.ts         # Transaction entity + Status enum
├── CashDispenser.ts       # (unused - logic in ATMSystem)
├── test.ts                # Test cases
├── tsconfig.json          # TypeScript config
└── README.md              # This file
```

---

## Key Design Decisions

### 1. State Pattern for ATM Flow
Each state encapsulates its own behavior. Invalid operations throw errors. Adding new states (e.g., MaintenanceState) doesn't affect existing code.

### 2. Greedy Algorithm for Cash Dispensing
Standard denominations allow greedy to find optimal solution. Deferred mutation — denomination map only updates after confirming exact change is possible.

### 3. Compensating Transaction for Rollback
If bank.withdraw() succeeds but cash dispensing fails, we call bank.deposit() to reverse the debit. Upfront currentBalance check minimizes how often rollback is needed.

### 4. Bank as Lightweight Service
Bank is a simple service (account map + basic operations), not a full banking system LLD. It handles authentication, balance management, and transaction recording.

### 5. Calculate in ATMSystem (not separate CashDispenser)
Kept the greedy algorithm in ATMSystem for simplicity. Could extract to CashDispenser class for single responsibility if needed.
