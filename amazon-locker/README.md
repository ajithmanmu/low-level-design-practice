# Amazon Locker System - LLD

Low-level design implementation of an Amazon Locker package delivery and pickup system.

## How to Run

```bash
ts-node test.ts
```

## Classes

### 1. Slot
- Represents a physical locker slot
- Properties: `id`, `size` (SMALL/MEDIUM/LARGE), `occupied`

### 2. Token
- Access code for package pickup
- Auto-generated UUID
- 5-day expiry from deposit time

### 3. Locker
- Main system class
- Handles deposit, pickup, and slot management
- Smart fallback: SMALL → MEDIUM → LARGE

## Key Features

- **Multiple locker sizes** (SMALL, MEDIUM, LARGE)
- **Smart slot assignment** with fallback logic
- **Token-based verification** for package pickup
- **Automatic expiry** handling (5 days)
- **Slot cleanup** and reuse after pickup

## Test Cases

1. Deposit SMALL package in SMALL slot
2. Deposit SMALL package with fallback to MEDIUM
3. Pickup package successfully
4. Slot reuse after pickup
5. Invalid pickup code (error handling)
6. No available slot (error handling)
7. Expired token (error handling)
8. Multiple deposits and pickups

## Design Patterns

- **Strategy Pattern**: Slot assignment with fallback sizes
- **Encapsulation**: Token generation and expiry logic
- **Single Responsibility**: Separate classes for Locker, Slot, and Token
