import { VendingMachine } from "./VendingMachine";
import { Product } from "./Product";
import { IdleState } from "./IdleState";
import { HasMoneyState } from "./HasMoneyState";
import { DispensingState } from "./DispensingState";

console.log("=== Vending Machine Test ===\n");

// Helper to create test data
function createTestVendingMachine() {
    // Create products
    const coke = new Product("Coke", "A1", 1.50, 5);
    const pepsi = new Product("Pepsi", "A2", 1.50, 3);
    const water = new Product("Water", "B1", 1.00, 10);
    const chips = new Product("Chips", "C1", 2.00, 2);
    const candy = new Product("Candy", "D1", 0.75, 0); // Out of stock

    // Product inventory
    const productInventory = new Map<string, Product>();
    productInventory.set("A1", coke);
    productInventory.set("A2", pepsi);
    productInventory.set("B1", water);
    productInventory.set("C1", chips);
    productInventory.set("D1", candy);

    // Cash inventory (denomination -> count)
    const cashInventory = new Map<string, number>();
    cashInventory.set("5", 5);      // Five $5 bills
    cashInventory.set("1", 10);     // Ten $1 bills
    cashInventory.set("0.25", 20);  // Twenty quarters
    cashInventory.set("0.1", 10);   // Ten dimes
    cashInventory.set("0.05", 10);  // Ten nickels

    const vendingMachine = new VendingMachine(productInventory, cashInventory);

    return { vendingMachine, coke, pepsi, water, chips, candy, productInventory, cashInventory };
}

// Test 1: Initial state is IdleState
console.log("Test 1: Initial state is IdleState");
const test1 = createTestVendingMachine();
console.log(`  State: ${test1.vendingMachine.getState().constructor.name}`);
const pass1 = test1.vendingMachine.getState() instanceof IdleState;
console.log(pass1 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Insert money transitions to HasMoneyState
console.log("Test 2: Insert money transitions to HasMoneyState");
const test2 = createTestVendingMachine();
test2.vendingMachine.insertMoney(1);
console.log(`  State after insert: ${test2.vendingMachine.getState().constructor.name}`);
console.log(`  Current balance: $${test2.vendingMachine.currentBalance}`);
const pass2 = test2.vendingMachine.getState() instanceof HasMoneyState &&
              test2.vendingMachine.currentBalance === 1;
console.log(pass2 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: Insert multiple amounts accumulates balance
console.log("Test 3: Insert multiple amounts accumulates balance");
const test3 = createTestVendingMachine();
test3.vendingMachine.insertMoney(1);
test3.vendingMachine.insertMoney(0.25);
test3.vendingMachine.insertMoney(0.25);
console.log(`  Inserted: $1 + $0.25 + $0.25`);
console.log(`  Current balance: $${test3.vendingMachine.currentBalance}`);
const pass3 = test3.vendingMachine.currentBalance === 1.5;
console.log(pass3 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 4: Happy path - buy product with exact change
console.log("Test 4: Buy product with exact payment (no change)");
const test4 = createTestVendingMachine();
test4.vendingMachine.insertMoney(1); // $1 for $1 water
test4.vendingMachine.selectProduct("B1"); // Water costs $1
const changes4 = test4.vendingMachine.dispense();
console.log(`  Product: Water ($1.00)`);
console.log(`  Paid: $1.00`);
console.log(`  Change returned: ${changes4.length === 0 ? "none" : changes4}`);
console.log(`  Water quantity after: ${test4.water.quantity}`);
console.log(`  State after: ${test4.vendingMachine.getState().constructor.name}`);
const pass4 = changes4.length === 0 &&
              test4.water.quantity === 9 &&
              test4.vendingMachine.getState() instanceof IdleState;
console.log(pass4 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: Happy path - buy product and get change
console.log("Test 5: Buy product and get change");
const test5 = createTestVendingMachine();
test5.vendingMachine.insertMoney(5); // $5 for $1.50 coke
test5.vendingMachine.selectProduct("A1"); // Coke costs $1.50
const changes5 = test5.vendingMachine.dispense();
const totalChange5 = changes5.reduce((sum: number, c: string) => sum + Number(c), 0);
console.log(`  Product: Coke ($1.50)`);
console.log(`  Paid: $5.00`);
console.log(`  Change returned: $${totalChange5} (${changes5.join(", ")})`);
console.log(`  Coke quantity after: ${test5.coke.quantity}`);
const pass5 = totalChange5 === 3.5 && test5.coke.quantity === 4;
console.log(pass5 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 6: Refund money
console.log("Test 6: Refund money after inserting");
const test6 = createTestVendingMachine();
test6.vendingMachine.insertMoney(1);
test6.vendingMachine.insertMoney(0.25);
console.log(`  Inserted: $1.25`);
const refund6 = test6.vendingMachine.refund();
const totalRefund6 = refund6.reduce((sum: number, c: string) => sum + Number(c), 0);
console.log(`  Refunded: $${totalRefund6} (${refund6.join(", ")})`);
console.log(`  Balance after refund: $${test6.vendingMachine.currentBalance}`);
console.log(`  State after: ${test6.vendingMachine.getState().constructor.name}`);
const pass6 = totalRefund6 === 1.25 &&
              test6.vendingMachine.currentBalance === 0 &&
              test6.vendingMachine.getState() instanceof IdleState;
console.log(pass6 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 7: Cannot select product in IdleState (no money)
console.log("Test 7: Cannot select product without money (should throw error)");
const test7 = createTestVendingMachine();
try {
    test7.vendingMachine.selectProduct("A1");
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 8: Cannot dispense in IdleState
console.log("Test 8: Cannot dispense without money (should throw error)");
const test8 = createTestVendingMachine();
try {
    test8.vendingMachine.dispense();
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 9: Cannot refund in IdleState (no money to refund)
console.log("Test 9: Cannot refund when no money inserted (should throw error)");
const test9 = createTestVendingMachine();
try {
    test9.vendingMachine.refund();
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 10: Insufficient funds
console.log("Test 10: Insufficient funds (should throw error)");
const test10 = createTestVendingMachine();
test10.vendingMachine.insertMoney(1); // $1 for $1.50 coke
try {
    test10.vendingMachine.selectProduct("A1"); // Coke costs $1.50
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Inserted: $1.00, Product price: $1.50`);
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 11: Product out of stock
console.log("Test 11: Product out of stock (should throw error)");
const test11 = createTestVendingMachine();
test11.vendingMachine.insertMoney(1);
try {
    test11.vendingMachine.selectProduct("D1"); // Candy is out of stock
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Product: Candy (quantity: ${test11.candy.quantity})`);
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 12: Invalid product code
console.log("Test 12: Invalid product code (should throw error)");
const test12 = createTestVendingMachine();
test12.vendingMachine.insertMoney(1);
try {
    test12.vendingMachine.selectProduct("Z9"); // Invalid code
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Product code: Z9`);
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 13: Cannot insert money during dispensing
console.log("Test 13: Cannot insert money during dispensing (should throw error)");
const test13 = createTestVendingMachine();
test13.vendingMachine.insertMoney(5);
test13.vendingMachine.selectProduct("A1"); // Now in DispensingState
console.log(`  State: ${test13.vendingMachine.getState().constructor.name}`);
try {
    test13.vendingMachine.insertMoney(1);
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 14: Cannot select product during dispensing
console.log("Test 14: Cannot select another product during dispensing (should throw error)");
const test14 = createTestVendingMachine();
test14.vendingMachine.insertMoney(5);
test14.vendingMachine.selectProduct("A1"); // Now in DispensingState
try {
    test14.vendingMachine.selectProduct("B1");
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 15: Show available products
console.log("Test 15: Show available products (excludes out of stock)");
const test15 = createTestVendingMachine();
const available15 = test15.vendingMachine.showAvailableProducts();
console.log(`  Total products: 5`);
console.log(`  Available products: ${available15.length}`);
const productNames = available15.map(([code, product]) => product.name).join(", ");
console.log(`  Products: ${productNames}`);
const pass15 = available15.length === 4; // Candy is out of stock
console.log(pass15 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 16: Cash inventory updates when inserting money
console.log("Test 16: Cash inventory updates when inserting money");
const test16 = createTestVendingMachine();
const initialQuarters = test16.vendingMachine.cashInventory.get("0.25");
test16.vendingMachine.insertMoney(0.25);
test16.vendingMachine.insertMoney(0.25);
const afterQuarters = test16.vendingMachine.cashInventory.get("0.25");
console.log(`  Initial quarters: ${initialQuarters}`);
console.log(`  Inserted: 2 quarters`);
console.log(`  Quarters after: ${afterQuarters}`);
const pass16 = afterQuarters === (initialQuarters || 0) + 2;
console.log(pass16 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 17: Cash inventory updates when giving change
console.log("Test 17: Cash inventory updates when giving change");
const test17 = createTestVendingMachine();
const initialDollars = test17.vendingMachine.cashInventory.get("1");
test17.vendingMachine.insertMoney(5); // Insert $5
test17.vendingMachine.selectProduct("A1"); // Buy Coke $1.50, change $3.50
test17.vendingMachine.dispense();
const afterDollars = test17.vendingMachine.cashInventory.get("1");
console.log(`  Initial $1 bills: ${initialDollars}`);
console.log(`  Change given includes $1 bills`);
console.log(`  $1 bills after: ${afterDollars}`);
const pass17 = (afterDollars || 0) < (initialDollars || 0); // Should have fewer $1 bills
console.log(pass17 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 18: Complete workflow - multiple transactions
console.log("Test 18: Complete workflow - multiple transactions");
const test18 = createTestVendingMachine();
// Transaction 1
test18.vendingMachine.insertMoney(1);
test18.vendingMachine.selectProduct("B1"); // Water $1
test18.vendingMachine.dispense();
console.log(`  Transaction 1: Bought Water, quantity now ${test18.water.quantity}`);
// Transaction 2
test18.vendingMachine.insertMoney(5);
test18.vendingMachine.selectProduct("C1"); // Chips $2
test18.vendingMachine.dispense();
console.log(`  Transaction 2: Bought Chips, quantity now ${test18.chips.quantity}`);
const pass18 = test18.water.quantity === 9 &&
               test18.chips.quantity === 1 &&
               test18.vendingMachine.getState() instanceof IdleState;
console.log(pass18 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 19: Cannot make exact change (should throw error)
console.log("Test 19: Cannot make exact change (should throw error)");
// Create machine with limited cash
const limitedCashInventory = new Map<string, number>();
limitedCashInventory.set("1", 0);     // No $1 bills
limitedCashInventory.set("0.25", 1);  // Only 1 quarter
const limitedProductInventory = new Map<string, Product>();
const expensiveItem = new Product("Premium", "P1", 1.00, 5);
limitedProductInventory.set("P1", expensiveItem);
const limitedMachine = new VendingMachine(limitedProductInventory, limitedCashInventory);
limitedMachine.insertMoney(5); // Insert $5, need $4 change, but only have $0.25
try {
    limitedMachine.selectProduct("P1");
    limitedMachine.dispense();
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Paid: $5, Price: $1, Change needed: $4`);
    console.log(`  Available: only $0.25`);
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

console.log("=== All Tests Complete ===");
