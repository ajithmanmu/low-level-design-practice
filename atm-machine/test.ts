import { ATMSystem } from "./ATMSystem";
import { Bank } from "./Bank";
import { Account } from "./Account";
import { Card } from "./Card";
import { IdleState } from "./IdleState";
import { CardInsertedState } from "./CardInsertedState";
import { AuthenticatedState } from "./AuthenticatedState";

console.log("=== ATM System Test ===\n");

// Helper to create test data
function createTestATM() {
    // Create accounts
    const account1 = new Account("ACC001");
    account1.balance = 5000;
    const account2 = new Account("ACC002");
    account2.balance = 200;

    // Create cards
    const card1 = new Card("CARD001", account1);
    card1.pin = 1234;
    const card2 = new Card("CARD002", account2);
    card2.pin = 5678;

    // Maps
    const accounts = new Map();
    accounts.set("ACC001", account1);
    accounts.set("ACC002", account2);

    const cards = new Map();
    cards.set("CARD001", card1);
    cards.set("CARD002", card2);

    const bank = new Bank(accounts, cards);

    // ATM denominations: 100x10, 50x10, 20x20, 10x20
    const denominations = new Map<number, number>();
    denominations.set(100, 10);
    denominations.set(50, 10);
    denominations.set(20, 20);
    denominations.set(10, 20);

    const atm = new ATMSystem(denominations, bank);
    // Set currentBalance to match denominations total
    atm.currentBalance = (100*10) + (50*10) + (20*20) + (10*20);

    return { atm, bank, account1, account2, card1, card2 };
}

// Test 1: Initial state is IdleState
console.log("Test 1: Initial state is IdleState");
const test1 = createTestATM();
console.log(`  State: ${test1.atm.state.constructor.name}`);
const pass1 = test1.atm.state instanceof IdleState;
console.log(pass1 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Insert card transitions to CardInsertedState
console.log("Test 2: Insert card transitions to CardInsertedState");
const test2 = createTestATM();
test2.atm.insertCard("CARD001");
console.log(`  State after insert: ${test2.atm.state.constructor.name}`);
console.log(`  Inserted card: ${test2.atm.insertedCard}`);
const pass2 = test2.atm.state instanceof CardInsertedState && test2.atm.insertedCard === "CARD001";
console.log(pass2 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: Correct PIN transitions to AuthenticatedState
console.log("Test 3: Correct PIN transitions to AuthenticatedState");
const test3 = createTestATM();
test3.atm.insertCard("CARD001");
test3.atm.enterPin(1234);
console.log(`  State after PIN: ${test3.atm.state.constructor.name}`);
const pass3 = test3.atm.state instanceof AuthenticatedState;
console.log(pass3 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 4: Wrong PIN stays in CardInsertedState
console.log("Test 4: Wrong PIN stays in CardInsertedState");
const test4 = createTestATM();
test4.atm.insertCard("CARD001");
try {
    test4.atm.enterPin(9999);
} catch(e) {}
console.log(`  State after wrong PIN: ${test4.atm.state.constructor.name}`);
const pass4 = test4.atm.state instanceof CardInsertedState;
console.log(pass4 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: 3 wrong PINs locks card, 4th attempt ejects to IdleState
console.log("Test 5: 3 wrong PIN attempts locks card, 4th attempt transitions to IdleState");
const test5 = createTestATM();
test5.atm.insertCard("CARD001");
try { test5.atm.enterPin(1111); } catch(e) {}
try { test5.atm.enterPin(2222); } catch(e) {}
try { test5.atm.enterPin(3333); } catch(e) {}
console.log(`  Attempts after 3 failures: ${test5.card1.attempts}`);
// 4th attempt — even correct PIN should fail with MAX_ATTEMPTS_EXCEEDED
try {
    test5.atm.enterPin(1234);
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  4th attempt error: ${(e as Error).message}`);
    console.log(`  State: ${test5.atm.state.constructor.name}`);
    const pass5 = test5.atm.state instanceof IdleState;
    console.log(pass5 ? "✅ PASS\n" : "❌ FAIL\n");
}

// Test 6: Check balance
console.log("Test 6: Check balance");
const test6 = createTestATM();
test6.atm.insertCard("CARD001");
test6.atm.enterPin(1234);
const balance6 = test6.atm.getBalance("ACC001");
console.log(`  Account balance: ${balance6}`);
const pass6 = balance6 === 5000;
console.log(pass6 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 7: Withdraw - happy path
console.log("Test 7: Withdraw $270 (greedy: 2x100, 1x50, 1x20)");
const test7 = createTestATM();
test7.atm.insertCard("CARD001");
test7.atm.enterPin(1234);
const initialATMBalance7 = test7.atm.currentBalance;
const dispense7 = test7.atm.withdraw("ACC001", 270);
console.log(`  Dispensed: ${dispense7}`);
console.log(`  Account balance: ${test7.account1.balance}`);
console.log(`  ATM balance: ${initialATMBalance7} → ${test7.atm.currentBalance}`);
const pass7 = test7.account1.balance === 4730 &&
              test7.atm.currentBalance === initialATMBalance7 - 270;
console.log(pass7 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 8: Deposit
console.log("Test 8: Deposit $500");
const test8 = createTestATM();
test8.atm.insertCard("CARD001");
test8.atm.enterPin(1234);
const initialATMBalance8 = test8.atm.currentBalance;
test8.atm.deposit("ACC001", 500);
console.log(`  Account balance: ${test8.account1.balance}`);
console.log(`  ATM balance: ${initialATMBalance8} → ${test8.atm.currentBalance}`);
const pass8 = test8.account1.balance === 5500 &&
              test8.atm.currentBalance === initialATMBalance8 + 500;
console.log(pass8 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 9: Eject card transitions to IdleState
console.log("Test 9: Eject card transitions to IdleState");
const test9 = createTestATM();
test9.atm.insertCard("CARD001");
test9.atm.enterPin(1234);
test9.atm.ejectCard();
console.log(`  State after eject: ${test9.atm.state.constructor.name}`);
console.log(`  Inserted card: ${test9.atm.insertedCard}`);
const pass9 = test9.atm.state instanceof IdleState && test9.atm.insertedCard === null;
console.log(pass9 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 10: Cannot enter PIN in IdleState
console.log("Test 10: Cannot enter PIN in IdleState (should throw)");
const test10 = createTestATM();
try {
    test10.atm.enterPin(1234);
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 11: Cannot withdraw in CardInsertedState
console.log("Test 11: Cannot withdraw in CardInsertedState (should throw)");
const test11 = createTestATM();
test11.atm.insertCard("CARD001");
try {
    test11.atm.withdraw("ACC001", 100);
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 12: Cannot insert card when card already inserted
console.log("Test 12: Cannot insert card when card already inserted (should throw)");
const test12 = createTestATM();
test12.atm.insertCard("CARD001");
try {
    test12.atm.insertCard("CARD002");
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 13: Insufficient account balance
console.log("Test 13: Insufficient account balance (should throw)");
const test13 = createTestATM();
test13.atm.insertCard("CARD002");
test13.atm.enterPin(5678);
try {
    test13.atm.withdraw("ACC002", 500); // Account only has $200
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  Account balance: ${test13.account2.balance}`);
    console.log(`  Withdraw amount: $500`);
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 14: ATM insufficient cash
console.log("Test 14: ATM insufficient cash (should throw)");
const test14 = createTestATM();
test14.atm.currentBalance = 50; // Override to low cash
test14.atm.insertCard("CARD001");
test14.atm.enterPin(1234);
try {
    test14.atm.withdraw("ACC001", 100);
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  ATM balance: $50, Withdraw: $100`);
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 15: Cannot make exact change - rollback
console.log("Test 15: Cannot dispense exact amount, bank withdrawal rolled back");
const denominations15 = new Map<number, number>();
denominations15.set(100, 5);
denominations15.set(50, 0);
denominations15.set(20, 0);
denominations15.set(10, 0);
const accounts15 = new Map();
const acc15 = new Account("ACC015");
acc15.balance = 1000;
accounts15.set("ACC015", acc15);
const cards15 = new Map();
const card15 = new Card("CARD015", acc15);
card15.pin = 1111;
cards15.set("CARD015", card15);
const bank15 = new Bank(accounts15, cards15);
const atm15 = new ATMSystem(denominations15, bank15);
atm15.currentBalance = 500;

atm15.insertCard("CARD015");
atm15.enterPin(1111);
try {
    atm15.withdraw("ACC015", 70); // Only $100 bills, can't make $70
    console.log("❌ FAIL - Should have thrown\n");
} catch(e) {
    console.log(`  ATM has only $100 bills, tried to withdraw $70`);
    console.log(`  Error: ${(e as Error).message}`);
    console.log(`  Account balance after rollback: ${acc15.balance}`);
    const pass15 = acc15.balance === 1000; // Should be rolled back
    console.log(pass15 ? "✅ PASS\n" : "❌ FAIL\n");
}

// Test 16: Multiple operations in one session
console.log("Test 16: Multiple operations in one authenticated session");
const test16 = createTestATM();
test16.atm.insertCard("CARD001");
test16.atm.enterPin(1234);

const bal16a = test16.atm.getBalance("ACC001");
console.log(`  Balance check: ${bal16a}`);

test16.atm.withdraw("ACC001", 100);
console.log(`  After withdraw $100: ${test16.account1.balance}`);

test16.atm.deposit("ACC001", 200);
console.log(`  After deposit $200: ${test16.account1.balance}`);

const bal16b = test16.atm.getBalance("ACC001");
console.log(`  Final balance: ${bal16b}`);

test16.atm.ejectCard();
console.log(`  State after eject: ${test16.atm.state.constructor.name}`);

const pass16 = test16.account1.balance === 5100 &&
               test16.atm.state instanceof IdleState;
console.log(pass16 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 17: Denomination map updates correctly after withdrawal
console.log("Test 17: Denomination map updates correctly");
const test17 = createTestATM();
test17.atm.insertCard("CARD001");
test17.atm.enterPin(1234);
const hundredsBefore = test17.atm.denominations.get(100);
const fiftysBefore = test17.atm.denominations.get(50);
test17.atm.withdraw("ACC001", 150); // Should dispense 1x100 + 1x50
const hundredsAfter = test17.atm.denominations.get(100);
const fiftysAfter = test17.atm.denominations.get(50);
console.log(`  $100 bills: ${hundredsBefore} → ${hundredsAfter}`);
console.log(`  $50 bills: ${fiftysBefore} → ${fiftysAfter}`);
const pass17 = hundredsAfter === (hundredsBefore || 0) - 1 &&
               fiftysAfter === (fiftysBefore || 0) - 1;
console.log(pass17 ? "✅ PASS\n" : "❌ FAIL\n");

console.log("=== All Tests Complete ===");
