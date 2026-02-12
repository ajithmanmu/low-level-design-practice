import { SplitWiseService, SplitType } from "./SplitWiseService";

console.log("=== Splitwise Test ===\n");

// Helper to get user/group by index (since IDs are random UUIDs)
function getUsers(service: SplitWiseService) {
    return [...service.users.values()];
}

function getGroups(service: SplitWiseService) {
    return [...service.groups.values()];
}

// Test 1: Create users
console.log("Test 1: Create users");
const service1 = new SplitWiseService();
service1.addUser("Alice");
service1.addUser("Bob");
service1.addUser("Charlie");
const users1 = getUsers(service1);
console.log(`  Created ${users1.length} users: ${users1.map(u => u.name).join(", ")}`);
const pass1 = users1.length === 3;
console.log(pass1 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Create group
console.log("Test 2: Create group");
const service2 = new SplitWiseService();
service2.createGroup("Roommates");
const groups2 = getGroups(service2);
console.log(`  Created group: ${groups2[0].name}`);
const pass2 = groups2.length === 1 && groups2[0].name === "Roommates";
console.log(pass2 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: Add members to group
console.log("Test 3: Add members to group");
const service3 = new SplitWiseService();
service3.addUser("Alice");
service3.addUser("Bob");
service3.createGroup("Trip");
const users3 = getUsers(service3);
const groups3 = getGroups(service3);
service3.addMemberToGroup(users3[0].id, groups3[0].id);
service3.addMemberToGroup(users3[1].id, groups3[0].id);
console.log(`  Group "${groups3[0].name}" has ${groups3[0].members.length} members`);
const pass3 = groups3[0].members.length === 2;
console.log(pass3 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 4: Equal split - 2 people, $100 expense
console.log("Test 4: Equal split - Alice pays $100, split with Bob");
const service4 = new SplitWiseService();
service4.addUser("Alice");
service4.addUser("Bob");
service4.createGroup("Dinner");
const users4 = getUsers(service4);
const [alice4, bob4] = users4;
const groups4 = getGroups(service4);
service4.addMemberToGroup(alice4.id, groups4[0].id);
service4.addMemberToGroup(bob4.id, groups4[0].id);

service4.addExpense(groups4[0].id, alice4.id, 100, "Dinner", SplitType.EQUAL, null);

const aliceBalance4 = alice4.getBalance(bob4.id);
const bobBalance4 = bob4.getBalance(alice4.id);
console.log(`  Alice's balance with Bob: ${aliceBalance4} (expects -50, Bob owes Alice)`);
console.log(`  Bob's balance with Alice: ${bobBalance4} (expects 50, Bob owes Alice)`);
const pass4 = aliceBalance4 === -50 && bobBalance4 === 50;
console.log(pass4 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: Equal split - 3 people, $90 expense
console.log("Test 5: Equal split - Alice pays $90, split with Bob and Charlie");
const service5 = new SplitWiseService();
service5.addUser("Alice");
service5.addUser("Bob");
service5.addUser("Charlie");
service5.createGroup("Lunch");
const users5 = getUsers(service5);
const [alice5, bob5, charlie5] = users5;
const groups5 = getGroups(service5);
service5.addMemberToGroup(alice5.id, groups5[0].id);
service5.addMemberToGroup(bob5.id, groups5[0].id);
service5.addMemberToGroup(charlie5.id, groups5[0].id);

service5.addExpense(groups5[0].id, alice5.id, 90, "Lunch", SplitType.EQUAL, null);

console.log(`  Alice's balance with Bob: ${alice5.getBalance(bob5.id)} (expects -30)`);
console.log(`  Alice's balance with Charlie: ${alice5.getBalance(charlie5.id)} (expects -30)`);
console.log(`  Bob's balance with Alice: ${bob5.getBalance(alice5.id)} (expects 30)`);
console.log(`  Charlie's balance with Alice: ${charlie5.getBalance(alice5.id)} (expects 30)`);
const pass5 = alice5.getBalance(bob5.id) === -30 &&
              alice5.getBalance(charlie5.id) === -30 &&
              bob5.getBalance(alice5.id) === 30 &&
              charlie5.getBalance(alice5.id) === 30;
console.log(pass5 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 6: Exact split
console.log("Test 6: Exact split - Alice pays $100, Bob owes $60, Charlie owes $40");
const service6 = new SplitWiseService();
service6.addUser("Alice");
service6.addUser("Bob");
service6.addUser("Charlie");
service6.createGroup("Groceries");
const users6 = getUsers(service6);
const [alice6, bob6, charlie6] = users6;
const groups6 = getGroups(service6);
service6.addMemberToGroup(alice6.id, groups6[0].id);
service6.addMemberToGroup(bob6.id, groups6[0].id);
service6.addMemberToGroup(charlie6.id, groups6[0].id);

const splitDetails6 = [
    { memberId: alice6.id, amount: 0 },
    { memberId: bob6.id, amount: 60 },
    { memberId: charlie6.id, amount: 40 }
];
service6.addExpense(groups6[0].id, alice6.id, 100, "Groceries", SplitType.EXACT, splitDetails6);

console.log(`  Bob's balance with Alice: ${bob6.getBalance(alice6.id)} (expects 60)`);
console.log(`  Charlie's balance with Alice: ${charlie6.getBalance(alice6.id)} (expects 40)`);
const pass6 = bob6.getBalance(alice6.id) === 60 && charlie6.getBalance(alice6.id) === 40;
console.log(pass6 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 7: Percentage split
console.log("Test 7: Percentage split - Alice pays $200, Bob 50%, Charlie 30%, Alice 20%");
const service7 = new SplitWiseService();
service7.addUser("Alice");
service7.addUser("Bob");
service7.addUser("Charlie");
service7.createGroup("Hotel");
const users7 = getUsers(service7);
const [alice7, bob7, charlie7] = users7;
const groups7 = getGroups(service7);
service7.addMemberToGroup(alice7.id, groups7[0].id);
service7.addMemberToGroup(bob7.id, groups7[0].id);
service7.addMemberToGroup(charlie7.id, groups7[0].id);

const splitDetails7 = [
    { memberId: alice7.id, percent: 20 },
    { memberId: bob7.id, percent: 50 },
    { memberId: charlie7.id, percent: 30 }
];
service7.addExpense(groups7[0].id, alice7.id, 200, "Hotel", SplitType.PERCENT, splitDetails7);

console.log(`  Bob's balance with Alice: ${bob7.getBalance(alice7.id)} (expects 100 = 50% of 200)`);
console.log(`  Charlie's balance with Alice: ${charlie7.getBalance(alice7.id)} (expects 60 = 30% of 200)`);
const pass7 = bob7.getBalance(alice7.id) === 100 && charlie7.getBalance(alice7.id) === 60;
console.log(pass7 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 8: Settle up - partial payment
console.log("Test 8: Settle up - Bob owes Alice $50, pays back $30");
const service8 = new SplitWiseService();
service8.addUser("Alice");
service8.addUser("Bob");
service8.createGroup("Coffee");
const users8 = getUsers(service8);
const [alice8, bob8] = users8;
const groups8 = getGroups(service8);
service8.addMemberToGroup(alice8.id, groups8[0].id);
service8.addMemberToGroup(bob8.id, groups8[0].id);

service8.addExpense(groups8[0].id, alice8.id, 100, "Coffee", SplitType.EQUAL, null);
console.log(`  Before settle: Bob owes Alice ${bob8.getBalance(alice8.id)}`);

service8.settleUp(bob8.id, alice8.id, 30);
console.log(`  After $30 payment: Bob owes Alice ${bob8.getBalance(alice8.id)} (expects 20)`);
console.log(`  Alice's balance with Bob: ${alice8.getBalance(bob8.id)} (expects -20)`);
const pass8 = bob8.getBalance(alice8.id) === 20 && alice8.getBalance(bob8.id) === -20;
console.log(pass8 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 9: Settle up - full payment
console.log("Test 9: Settle up - Bob pays remaining $20");
service8.settleUp(bob8.id, alice8.id, 20);
console.log(`  After full payment: Bob owes Alice ${bob8.getBalance(alice8.id)} (expects 0)`);
console.log(`  Alice's balance with Bob: ${alice8.getBalance(bob8.id)} (expects 0)`);
const pass9 = bob8.getBalance(alice8.id) === 0 && alice8.getBalance(bob8.id) === 0;
console.log(pass9 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 10: Transaction history
console.log("Test 10: Transaction history recorded");
const transactions8 = [...service8.transactions.values()];
console.log(`  Total transactions: ${transactions8.length} (expects 2)`);
console.log(`  Transaction 1: ${transactions8[0].from.name} → ${transactions8[0].to.name}: $${transactions8[0].amount}`);
console.log(`  Transaction 2: ${transactions8[1].from.name} → ${transactions8[1].to.name}: $${transactions8[1].amount}`);
const pass10 = transactions8.length === 2;
console.log(pass10 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 11: Multiple expenses in same group
console.log("Test 11: Multiple expenses - Alice pays $60, then Bob pays $30");
const service11 = new SplitWiseService();
service11.addUser("Alice");
service11.addUser("Bob");
service11.createGroup("Shared");
const users11 = getUsers(service11);
const [alice11, bob11] = users11;
const groups11 = getGroups(service11);
service11.addMemberToGroup(alice11.id, groups11[0].id);
service11.addMemberToGroup(bob11.id, groups11[0].id);

// Alice pays $60 (each owes $30, so Bob owes Alice $30)
service11.addExpense(groups11[0].id, alice11.id, 60, "Expense 1", SplitType.EQUAL, null);
console.log(`  After Alice pays $60: Bob owes Alice ${bob11.getBalance(alice11.id)}`);

// Bob pays $30 (each owes $15, so Alice owes Bob $15)
service11.addExpense(groups11[0].id, bob11.id, 30, "Expense 2", SplitType.EQUAL, null);
console.log(`  After Bob pays $30: Bob owes Alice ${bob11.getBalance(alice11.id)} (expects 15)`);
console.log(`  Alice owes Bob: ${alice11.getBalance(bob11.id)} (expects -15)`);

// Net: Bob owed Alice $30, then Alice owed Bob $15 → Bob owes Alice $15
const pass11 = bob11.getBalance(alice11.id) === 15 && alice11.getBalance(bob11.id) === -15;
console.log(pass11 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 12: getBalances returns all balances for a user
console.log("Test 12: getBalances returns full balance map");
const balances11 = service11.getBalances(bob11.id);
console.log(`  Bob's balances: ${[...balances11.entries()].map(([k, v]) => `${v}`).join(", ")}`);
const pass12 = balances11.size === 1 && balances11.get(alice11.id) === 15;
console.log(pass12 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 13: Error - user not found
console.log("Test 13: Error handling - user not found");
const service13 = new SplitWiseService();
try {
    service13.getBalances("nonexistent-id");
    console.log("❌ FAIL - Should have thrown\n");
} catch (e) {
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 14: Error - group not found
console.log("Test 14: Error handling - group not found");
const service14 = new SplitWiseService();
service14.addUser("Alice");
const users14 = getUsers(service14);
try {
    service14.addMemberToGroup(users14[0].id, "nonexistent-group");
    console.log("❌ FAIL - Should have thrown\n");
} catch (e) {
    console.log(`  Error: ${(e as Error).message}`);
    console.log("✅ PASS\n");
}

console.log("=== All Tests Complete ===");
