# Vending Machine - Low Level Design

## Problem Statement

Design a Vending Machine system that:
- Displays available products with prices and quantities
- Accepts money in supported denominations (coins and bills)
- Allows product selection by code (e.g., "A1", "B2")
- Dispenses product if sufficient money is inserted
- Returns correct change using a greedy algorithm
- Handles refunds if user cancels transaction

---

## Key Pattern: State Pattern

The vending machine uses the **State Pattern** because the same operations behave differently depending on the machine's current state.

### States

| State | Description | Valid Operations |
|-------|-------------|------------------|
| **IdleState** | Waiting for user | insertMoney |
| **HasMoneyState** | Money inserted | insertMoney, selectProduct, refund |
| **DispensingState** | Ready to dispense | dispense |

### State Diagram

```
                    insertMoney()
    ┌─────────────────────────────────────┐
    │                                     ▼
┌───────────┐  insertMoney()  ┌───────────────────┐
│           │ ───────────────▶│                   │
│ IdleState │                 │  HasMoneyState    │◀──┐
│           │◀────────────────│                   │   │ insertMoney()
└───────────┘     refund()    └───────────────────┘───┘
      ▲                              │
      │                              │ selectProduct()
      │                              ▼
      │                       ┌───────────────────┐
      │       dispense()      │                   │
      └───────────────────────│ DispensingState   │
                              │                   │
                              └───────────────────┘
```

---

## Class Design

### MachineState (Interface)
Defines the contract for all states.

**Methods:**
- `insertMoney(vendingMachine, amount)` → Handle money insertion
- `selectProduct(vendingMachine, productCode)` → Handle product selection
- `dispense(vendingMachine)` → Handle dispensing
- `refund(vendingMachine)` → Handle refund request

### VendingMachine (Context)
Holds state and delegates operations to current state.

**Properties:**
- `state: MachineState` - Current state
- `productInventory: Map<code, Product>` - Available products
- `cashInventory: Map<denomination, count>` - Available cash for change
- `currentBalance: number` - Money inserted in current transaction
- `selectedProduct: Product` - Product selected for purchase

**Methods:**
- `insertMoney(amount)` → Delegates to state
- `selectProduct(code)` → Delegates to state
- `dispense()` → Delegates to state
- `refund()` → Delegates to state
- `showAvailableProducts()` → Returns products with quantity > 0
- `calculateChange(amount)` → Greedy algorithm for change

### Product
Represents a product in the machine.

**Properties:**
- `name: string` - Display name
- `code: string` - Selection code (e.g., "A1")
- `price: number` - Cost
- `quantity: number` - Available stock

### IdleState
Machine waiting for user interaction.

- `insertMoney()` → Accept, transition to HasMoneyState
- `selectProduct()` → Reject ("Please insert money first")
- `dispense()` → Reject
- `refund()` → Reject ("No money to refund")

### HasMoneyState
Money has been inserted, waiting for selection.

- `insertMoney()` → Add to balance, update cash inventory
- `selectProduct()` → Validate availability & funds, transition to DispensingState
- `dispense()` → Reject ("Please select product")
- `refund()` → Return money, transition to IdleState

### DispensingState
Product selected, ready to dispense.

- `insertMoney()` → Reject
- `selectProduct()` → Reject
- `dispense()` → Decrement quantity, calculate change, transition to IdleState
- `refund()` → Reject

---

## Change Calculation (Greedy Algorithm)

```typescript
calculateChange(changeNeeded: number): string[] {
    // 1. Sort denominations largest to smallest
    // 2. For each denomination:
    //    - Use as many as possible while changeNeeded >= denom and count > 0
    // 3. If changeNeeded > 0 at end, throw "Cannot provide exact change"
}
```

**Example:**
- Balance: $5.00, Product: $1.50, Change needed: $3.50
- Result: [$1, $1, $1, $0.25, $0.25]

---

## How to Run

```bash
npx ts-node test.ts
```

---

## Test Cases (19 tests)

| # | Test Case |
|---|-----------|
| 1 | Initial state is IdleState |
| 2 | Insert money transitions to HasMoneyState |
| 3 | Insert multiple amounts accumulates balance |
| 4 | Buy product with exact payment (no change) |
| 5 | Buy product and get change |
| 6 | Refund money after inserting |
| 7 | Cannot select product without money |
| 8 | Cannot dispense without money |
| 9 | Cannot refund when no money inserted |
| 10 | Insufficient funds |
| 11 | Product out of stock |
| 12 | Invalid product code |
| 13 | Cannot insert money during dispensing |
| 14 | Cannot select product during dispensing |
| 15 | Show available products (excludes out of stock) |
| 16 | Cash inventory updates when inserting money |
| 17 | Cash inventory updates when giving change |
| 18 | Complete workflow - multiple transactions |
| 19 | Cannot make exact change |

---

## Files

```
vending-machine/
├── MachineState.ts      # State interface
├── IdleState.ts         # Idle state implementation
├── HasMoneyState.ts     # Has money state implementation
├── DispensingState.ts   # Dispensing state implementation
├── VendingMachine.ts    # Context class
├── Product.ts           # Product entity
├── test.ts              # Test cases
├── tsconfig.json        # TypeScript config
└── README.md            # This file
```

---

## Key Design Decisions

### 1. State Pattern for Transaction Flow
Instead of if-else chains checking machine status, each state encapsulates its own behavior. Adding new states (e.g., MaintenanceState) doesn't affect existing code.

### 2. Greedy Algorithm for Change
Standard coin denominations allow greedy to always find optimal solution. Simple and efficient O(n) where n = number of denominations.

### 3. String Keys for Cash Inventory
Using string keys (`"0.25"` instead of `0.25`) avoids JavaScript floating-point comparison issues.

### 4. Product Quantity on Product Class
Unlike Library (Book vs BookItem), vending machine items are interchangeable - no need for individual item tracking.

### 5. Cash Inventory Updates on Insert
When user inserts money, it's added to machine's cash inventory immediately. This ensures the machine can use it for future change.

---

## Extension Ideas

- **Exact Change Only mode:** Detect when machine can't guarantee change
- **Multiple payment methods:** Card, mobile payments via Strategy Pattern
- **Admin operations:** Restock products, collect cash
- **Recommendations:** "Customers who bought X also bought Y"
- **Remote monitoring:** IoT integration for inventory alerts

---

## Interview Notes

See Obsidian: `LLD/Vending Machine - Interview Questions.md` for:
- Detailed interview questions and answers
- Extension scenarios
- Scale considerations
- Database schema design
