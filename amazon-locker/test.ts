import { Locker } from "./Locker";
import { Slot, SlotSize } from "./Slot";

console.log("=== Amazon Locker System Test ===\n");

// Helper to create slots
function createSlots(): Slot[] {
    return [
        new Slot(1, SlotSize.SMALL),
        new Slot(2, SlotSize.SMALL),
        new Slot(3, SlotSize.MEDIUM),
        new Slot(4, SlotSize.MEDIUM),
        new Slot(5, SlotSize.LARGE),
    ];
}

// Test 1: Deposit SMALL package in SMALL slot
console.log("Test 1: Deposit SMALL package");
const locker1 = new Locker(createSlots());
const package1 = { size: SlotSize.SMALL };
const result1 = locker1.depositPackage(package1);
console.log(`  Deposited in slot ${result1.slot.id} (${result1.slot.size})`);
console.log(`  Access code: ${result1.accessToken.getCode()}`);
console.log(result1.slot.size === SlotSize.SMALL ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Deposit with fallback (SMALL package in MEDIUM slot)
console.log("Test 2: Deposit SMALL package with fallback to MEDIUM");
const locker2 = new Locker(createSlots());
locker2.depositPackage({ size: SlotSize.SMALL }); // Occupy slot 1
locker2.depositPackage({ size: SlotSize.SMALL }); // Occupy slot 2
const result2 = locker2.depositPackage({ size: SlotSize.SMALL }); // Should go to MEDIUM
console.log(`  Deposited in slot ${result2.slot.id} (${result2.slot.size})`);
console.log(result2.slot.size === SlotSize.MEDIUM ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: Successful pickup
console.log("Test 3: Pickup package successfully");
const locker3 = new Locker(createSlots());
const { accessToken, slot } = locker3.depositPackage({ size: SlotSize.SMALL });
const code = accessToken.getCode();
console.log(`  Pickup code: ${code}`);
const pickedSlot = locker3.pickup(code);
console.log(`  Picked up from slot ${pickedSlot.id}`);
console.log(pickedSlot.id === slot.id && !pickedSlot.occupied ? "✅ PASS\n" : "❌ FAIL\n");

// Test 4: Slot reuse after pickup
console.log("Test 4: Slot reuse after pickup");
const locker4 = new Locker([new Slot(1, SlotSize.SMALL)]);
const result4a = locker4.depositPackage({ size: SlotSize.SMALL });
locker4.pickup(result4a.accessToken.getCode());
const result4b = locker4.depositPackage({ size: SlotSize.SMALL });
console.log(`  First deposit: slot ${result4a.slot.id}`);
console.log(`  After pickup: slot occupied = ${result4a.slot.occupied}`);
console.log(`  Second deposit: slot ${result4b.slot.id}`);
console.log(result4a.slot.id === result4b.slot.id && result4b.slot.occupied ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: Invalid pickup code
console.log("Test 5: Pickup with invalid code (should throw error)");
const locker5 = new Locker(createSlots());
try {
    locker5.pickup("INVALID-CODE");
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 6: No available slot
console.log("Test 6: Deposit when no slot available (should throw error)");
const locker6 = new Locker([new Slot(1, SlotSize.SMALL)]);
locker6.depositPackage({ size: SlotSize.SMALL }); // Occupy the only slot
try {
    locker6.depositPackage({ size: SlotSize.SMALL });
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 7: Expired token
console.log("Test 7: Pickup with expired token (should throw error)");
const locker7 = new Locker(createSlots());
const result7 = locker7.depositPackage({ size: SlotSize.SMALL });
// Manually expire the token
(result7.accessToken as any).expiry = Date.now() - 1000;
try {
    locker7.pickup(result7.accessToken.getCode());
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log(`  Slot cleared: ${!result7.slot.occupied}`);
    console.log("✅ PASS\n");
}

// Test 8: Multiple deposits and pickups
console.log("Test 8: Multiple deposits and pickups");
const locker8 = new Locker(createSlots());
const r1 = locker8.depositPackage({ size: SlotSize.SMALL });
const r2 = locker8.depositPackage({ size: SlotSize.MEDIUM });
const r3 = locker8.depositPackage({ size: SlotSize.LARGE });
console.log(`  Deposited 3 packages: slots ${r1.slot.id}, ${r2.slot.id}, ${r3.slot.id}`);
locker8.pickup(r2.accessToken.getCode());
locker8.pickup(r1.accessToken.getCode());
locker8.pickup(r3.accessToken.getCode());
const allFree = locker8.slots.every(s => !s.occupied);
console.log(`  All slots free: ${allFree}`);
console.log(allFree ? "✅ PASS\n" : "❌ FAIL\n");

console.log("=== All Tests Complete ===");
