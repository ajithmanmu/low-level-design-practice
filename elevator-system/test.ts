import { Elevator } from "./Elevator";
import { ElevatorSystem } from "./ElevatorSystem";
import { Direction } from "./Direction";

console.log("=== Elevator System Test ===\n");

// Helper function to print elevator status
function printStatus(system: any) {
  console.log("  Elevator Status:");
  for (let [id, elevator] of system.elevatorMap) {
    console.log(`    Elevator ${id}: Floor ${elevator.currentFloor}, Moving: ${elevator.isMoving}, Direction: ${elevator.direction}, Destinations: [${elevator.destinationFloor}]`);
  }
}

// Test 1: Single elevator, single destination
console.log("Test 1: Single elevator moving to floor 5");
const elevator1 = new Elevator(1);
const system1 = new ElevatorSystem(10, [elevator1]);

system1.requestElevator(5, Direction.UP);
console.log("  After request (before movement):");
printStatus(system1);

// Simulate movement
for (let i = 0; i < 6; i++) {
  system1.step();
}

console.log("  After 6 steps:");
printStatus(system1);
console.log(elevator1.currentFloor === 5 && !elevator1.isMoving ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Single elevator, multiple destinations
console.log("Test 2: Elevator with multiple destinations (3, 7, 9)");
const elevator2 = new Elevator(1);
const system2 = new ElevatorSystem(10, [elevator2]);

system2.selectFloor(1, 3);
system2.selectFloor(1, 7);
system2.selectFloor(1, 9);

console.log("  Initial state:");
printStatus(system2);

// Move to floor 3
for (let i = 0; i < 3; i++) {
  system2.step();
}
console.log('elevator2 TEST', elevator2.destinationFloor)
console.log("  After reaching floor 3:");
printStatus(system2);

// Move to floor 7
for (let i = 0; i < 4; i++) {
  system2.step();
}
console.log("  After reaching floor 7:");
printStatus(system2);

// Move to floor 9
for (let i = 0; i < 2; i++) {
  system2.step();
}
console.log('elevator2 TEST 3', elevator2.destinationFloor)
console.log("  After reaching floor 9:");
printStatus(system2);

console.log(elevator2.currentFloor === 9 && elevator2.destinationFloor.length === 0 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: Multiple elevators
console.log("Test 3: Multiple elevators (3 elevators in building)");
const elev1 = new Elevator(1);
const elev2 = new Elevator(2);
const elev3 = new Elevator(3);
const system3 = new ElevatorSystem(10, [elev1, elev2, elev3]);

// Set initial positions
elev1.currentFloor = 0;
elev2.currentFloor = 5;
elev3.currentFloor = 8;

console.log("  Initial positions:");
printStatus(system3);

// Request elevator from floor 6 going up
system3.requestElevator(6, Direction.UP);

console.log("  After request from floor 6 (should assign closest idle elevator):");
printStatus(system3);

// Simulate movement
for (let i = 0; i < 3; i++) {
  system3.step();
}

console.log("  After movement:");
printStatus(system3);

// Check that an elevator went to floor 6
let anyAtFloor6 = false;
for (let [id, elev] of system3.elevatorMap) {
  if (elev.currentFloor === 6) {
    anyAtFloor6 = true;
    break;
  }
}
console.log(anyAtFloor6 ? "✅ PASS - An elevator reached floor 6\n" : "❌ FAIL\n");

// Test 4: Elevator going down
console.log("Test 4: Elevator moving down from floor 8 to floor 3");
const elevator4 = new Elevator(1);
elevator4.currentFloor = 8;
const system4 = new ElevatorSystem(10, [elevator4]);

system4.selectFloor(1, 3);

console.log("  Initial state (floor 8):");
printStatus(system4);

// Move down 5 floors
for (let i = 0; i < 5; i++) {
  system4.step();
}

console.log("  After 5 steps (should be at floor 3):");
printStatus(system4);

console.log(elevator4.currentFloor === 3 && !elevator4.isMoving ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: Elevator already at destination
console.log("Test 5: Request elevator when already at floor");
const elevator5 = new Elevator(1);
elevator5.currentFloor = 4;
const system5 = new ElevatorSystem(10, [elevator5]);

system5.selectFloor(1, 4);

console.log("  State before step (already at floor 4):");
printStatus(system5);

system5.step();

console.log("  After 1 step:");
printStatus(system5);

console.log(elevator5.currentFloor === 4 && elevator5.destinationFloor.length === 0 ? "✅ PASS - Destination removed immediately\n" : "❌ FAIL\n");

// Test 6: Step with no movement (all elevators idle)
console.log("Test 6: Step when all elevators are idle");
const elevator6 = new Elevator(1);
const system6 = new ElevatorSystem(10, [elevator6]);

console.log("  Initial state (no requests):");
printStatus(system6);

system6.step();

console.log("  After step (should remain idle):");
printStatus(system6);

console.log(!elevator6.isMoving && elevator6.currentFloor === 0 ? "✅ PASS - Elevator remained idle\n" : "❌ FAIL\n");

console.log("=== All Tests Complete ===");
