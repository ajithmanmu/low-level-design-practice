import { Vehicle, VehicleType } from './Vehicle';
import { ParkingSpot, SpotType } from './ParkingSpot';
import { ParkingLevel } from './ParkingLevel';
import { ParkingLot } from './ParkingLot';

// Helper function to create spots for a single level
function createSpotsForLevel(levelNumber: number): ParkingSpot[] {
    const spots: ParkingSpot[] = [];
    let spotNumber = 1;

    // Create 10 motorcycle spots
    for (let i = 0; i < 10; i++) {
        spots.push(new ParkingSpot(SpotType.MOTORCYCLE, spotNumber++));
    }

    // Create 10 compact spots
    for (let i = 0; i < 10; i++) {
        spots.push(new ParkingSpot(SpotType.COMPACT, spotNumber++));
    }

    // Create 10 large spots
    for (let i = 0; i < 10; i++) {
        spots.push(new ParkingSpot(SpotType.LARGE, spotNumber++));
    }

    return spots;
}

// Helper function to create a parking lot with specified number of levels
function createParkingLot(numLevels: number): ParkingLot {
    const levels: ParkingLevel[] = [];

    for (let i = 1; i <= numLevels; i++) {
        const spots = createSpotsForLevel(i);
        levels.push(new ParkingLevel(i, spots));
    }

    return new ParkingLot(levels);
}

// Setup: Create a parking lot with 3 levels (90 total spots)
const parkingLot = createParkingLot(3);

console.log('='.repeat(50));
console.log('PARKING LOT SYSTEM - TEST SUITE');
console.log('='.repeat(50));
console.log();
console.log('✓ Parking lot created with 3 levels');
console.log('✓ Total available spots:', parkingLot.getAvailableSpots()); // Should be 90
console.log();

// ============================================
// TEST CASES
// ============================================

// Test 1: Park a motorcycle
console.log('Test 1: Park a motorcycle');
const vehicle1 = new Vehicle(VehicleType.MOTORCYCLE, 'L1');
const result1 = parkingLot.parkVehicle(vehicle1);
console.log('  Result:', result1 ? `✓ Parked at spot ${result1.spot.spotNumber}` : '✗ Failed');
console.log();

// Test 2: Park a car
console.log('Test 2: Park a car');
const vehicle2 = new Vehicle(VehicleType.CAR, 'L2');
const result2 = parkingLot.parkVehicle(vehicle2);
console.log('  Result:', result2 ? `✓ Parked at spot ${result2.spot.spotNumber}` : '✗ Failed');
console.log();

// Test 3: Park a truck
console.log('Test 3: Park a truck');
const vehicle3 = new Vehicle(VehicleType.TRUCK, 'L3');
const result3 = parkingLot.parkVehicle(vehicle3);
console.log('  Result:', result3 ? `✓ Parked at spot ${result3.spot.spotNumber}` : '✗ Failed');
console.log();

// Test 4: Check available spots after parking
console.log('Test 4: Check available spots after parking 3 vehicles');
const count = parkingLot.getAvailableSpots();
console.log('  Available spots:', count, '(Expected: 87)');
console.log();

// Test 5: Remove a vehicle and check fee
console.log('Test 5: Remove a vehicle and check fee');
const vehicle4 = new Vehicle(VehicleType.MOTORCYCLE, 'L4');
const ticket = parkingLot.parkVehicle(vehicle4);
if (ticket) {
    console.log('  Parked vehicle4 at spot', ticket.spot.spotNumber);
    const cost = parkingLot.removeVehicle(ticket);
    console.log('  Total cost for parking:', `$${cost}`, '(Expected: $0 - no time passed)');
} else {
    console.log('  ✗ Failed to park vehicle');
}
console.log();

// Test 6: Try to park when lot is full
console.log('Test 6: Fill the parking lot and try to park');
console.log('  Parking 87 more vehicles to fill remaining spots...');
// We already parked 4 (3 still parked + 1 removed = 3 currently)
// Need to park 87 more to fill all 90 spots
for(let i=1; i<=87; i+=1) {
    const vehicle = new Vehicle(VehicleType.MOTORCYCLE, `FILLER-${i}`);
    parkingLot.parkVehicle(vehicle);
}
console.log('  Available spots now:', parkingLot.getAvailableSpots(), '(Expected: 0)');
console.log('  Attempting to park one more vehicle...');
const vehicle5 = new Vehicle(VehicleType.TRUCK, 'L5');
const result5 = parkingLot.parkVehicle(vehicle5);
if(!result5) {
    console.log('  ✓ Parking lot is full (as expected)');
} else {
    console.log('  ✗ Unexpected: Vehicle was parked');
}
console.log();

console.log('='.repeat(50));
console.log('ALL TESTS COMPLETED');
console.log('='.repeat(50));

// TEST INSTRUCTIONS: Run ts-node test.ts