# Banking & Financial Systems

This folder contains two related LLD problems focused on banking and financial systems.

---

## 1. Banking System (Ramp Assessment)

**File:** [banking-system.ts](./banking-system.ts)

### Problem Overview
Multi-level banking system with progressive complexity across 4 levels.

### 4 Levels

**Level 1: Basic Operations**
- `createAccount(timestamp, accountId)` - Create new account
- `deposit(timestamp, accountId, amount)` - Deposit money
- `pay(timestamp, accountId, amount)` - Withdraw/pay money

**Level 2: Account Ranking**
- `topActivity(timestamp, n)` - Get top n accounts by total transaction value
- Sorted by transaction value (descending), then account ID (ascending)

**Level 3: Scheduled Transfers**
- `scheduleTransfer(timestamp, sourceId, targetId, amount)` - Schedule a transfer
- `acceptTransfer(timestamp, accountId, transferId)` - Accept pending transfer
- Transfers expire after 24 hours
- Transaction history only updated on accept, not on schedule

**Level 4: Account Merging**
- `mergeAccounts(timestamp, accountId1, accountId2)` - Merge account2 into account1
- Combines balances and transaction histories

### Critical Concept: Available Balance

**The key learning from this problem:**

When a transfer is **scheduled**, funds are "reserved" from the source account:
- **Actual balance**: Total money in account
- **Pending outgoing**: Sum of pending transfer amounts
- **Available balance**: Actual balance - Pending outgoing

**All operations must check AVAILABLE balance, not actual balance.**

Example:
```
account1: balance = 1000
scheduleTransfer(account1 → account2, 600)
  → Actual balance: 1000 (not deducted yet)
  → Pending outgoing: 600
  → Available balance: 400

pay(account1, 500) → FAIL (only 400 available)
```

### Common Bugs
❌ Not accounting for pending transfers in balance checks
❌ Off-by-one errors in expiration (24 hours = 86400000 ms)
❌ Updating transaction history on schedule instead of accept
❌ Not counting transfer amount for both source AND target in transaction totals

---

## 2. Financial Ledger (Practice)

**File:** [financial-ledger.ts](./financial-ledger.ts)

### Problem Overview
Simple financial ledger system - good warm-up for the Banking System.

### Features
- `deposit(amount)` - Add money to ledger
- `withdraw(amount)` - Remove money from ledger
- `getBalance()` - Get current balance
- `getTransactionHistory()` - View all transactions
- `refund(transactionId)` - Reverse a transaction

### Refund Logic
- Refund of DEPOSIT → Acts like WITHDRAWAL (removes money)
- Refund of WITHDRAWAL → Acts like DEPOSIT (returns money)
- Refund of REFUND → Recursively refunds original transaction

### Key Patterns
- Transaction tracking with timestamps
- Map for O(1) transaction lookup
- Immutable transaction history (returns copy)
- Metadata tracking (refundedTransactionId)

---

## Comparison

| Feature | Financial Ledger | Banking System |
|---------|-----------------|----------------|
| Complexity | Simple | Complex (4 levels) |
| Accounts | Single ledger | Multiple accounts |
| Transfers | No | Yes (with pending state) |
| Key Concept | Refund logic | Available balance |
| Good For | Warm-up practice | Interview assessment |

---

## Review Checklist

Before interviews, review:
- [ ] Available balance calculation
- [ ] Pending transfer state management
- [ ] Expiration timing (24 hours)
- [ ] Transaction history update timing (on accept, not schedule)
- [ ] Refund logic (deposit vs withdrawal)
- [ ] Sorting logic for topActivity (value desc, ID asc)

---

**Practice Tip:** Start with Financial Ledger to understand transaction tracking, then move to Banking System for the full complexity.
