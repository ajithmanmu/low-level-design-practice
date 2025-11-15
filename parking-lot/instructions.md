Parking Lot System - Requirements

  Functional Requirements

  1. The parking lot has 3 levels (Level 1, Level 2, Level 3)
  2. Each level has 30 parking spots:
    - 10 Motorcycle spots
    - 10 Compact spots
    - 10 Large spots
  3. Three types of vehicles:
    - Motorcycle (can park in any spot)
    - Car (can park in Compact or Large spot)
    - Truck (can only park in Large spot)
  4. When a vehicle enters:
    - Find an available spot that fits the vehicle
    - Assign the spot
    - Issue a parking ticket with:
        - Ticket ID
      - Vehicle info
      - Spot assigned
      - Entry time
  5. When a vehicle exits:
    - Accept the ticket
    - Calculate parking fee: $5/hour
    - Free the spot
    - Return total fee
  6. Track availability:
    - Know which spots are occupied
    - Know which spots are available

  ---
  Classes You Need

  // 1. Vehicle (base class)
  class Vehicle {
    constructor(licensePlate, type)
    // type: 'MOTORCYCLE', 'CAR', 'TRUCK'
  }

  // 2. ParkingSpot
  class ParkingSpot {
    constructor(spotNumber, spotType)
    // spotType: 'MOTORCYCLE', 'COMPACT', 'LARGE'

    isAvailable()
    park(vehicle)
    removeVehicle()
    canFitVehicle(vehicle)
  }

  // 3. ParkingLevel
  class ParkingLevel {
    constructor(levelNumber, spotsPerType)
    // spotsPerType: { MOTORCYCLE: 10, COMPACT: 10, LARGE: 10 }

    findAvailableSpot(vehicle)
    parkVehicle(vehicle)
  }

  // 4. ParkingTicket
  class ParkingTicket {
    constructor(ticketId, vehicle, spot, entryTime)

    calculateFee()
  }

  // 5. ParkingLot
  class ParkingLot {
    constructor(numLevels)

    parkVehicle(vehicle)  // returns Ticket or null
    removeVehicle(ticket) // returns fee
    getAvailableSpots()   // returns count
  }

  ---
  Core Methods to Implement

  ParkingLot:
  - parkVehicle(vehicle) → Find spot across all levels, issue ticket
  - removeVehicle(ticket) → Calculate fee, free spot, return amount

  ParkingLevel:
  - findAvailableSpot(vehicle) → Find first available spot that fits vehicle
  - parkVehicle(vehicle) → Park in the spot

  ParkingSpot:
  - canFitVehicle(vehicle) → Check if vehicle fits in this spot type
  - park(vehicle) → Mark spot as occupied
  - removeVehicle() → Mark spot as available

  ParkingTicket:
  - calculateFee() → (current time - entry time) × $5/hour

  ---
  Rules for Spot Assignment

  Motorcycle:
  - Can park in: Motorcycle, Compact, OR Large spot
  - Priority: Try Motorcycle spot first

  Car:
  - Can park in: Compact OR Large spot
  - Priority: Try Compact spot first

  Truck:
  - Can park in: Large spot ONLY

  ---
  Example Usage

  const parkingLot = new ParkingLot(3); // 3 levels

  // Vehicle arrives
  const car = new Vehicle('ABC-123', 'CAR');
  const ticket = parkingLot.parkVehicle(car);
  // ticket = { ticketId: '001', vehicle: car, spot: CompactSpot#5, entryTime: '10:00 AM' }

  // Vehicle leaves after 2 hours
  const fee = parkingLot.removeVehicle(ticket);
  // fee = $10 (2 hours × $5/hour)

  ---
  Edge Cases to Handle

  1. Parking lot full: Return null when no spots available
  2. Invalid ticket: Handle gracefully
  3. Spot already occupied: Don't allow double parking
  4. Negative time: Handle clock edge cases

  ---
  Testing Scenarios

  Write tests for:
  1. Park a motorcycle (should get motorcycle spot)
  2. Park a car (should get compact spot if available)
  3. Park a truck (should get large spot)
  4. Park when lot is full (should return null)
  5. Remove vehicle and calculate correct fee
  6. Park multiple vehicles across levels

  ---
  Your Action Plan

  Wed (Design):
  - Create files: Vehicle.js, ParkingSpot.js, ParkingLevel.js, ParkingTicket.js, ParkingLot.js
  - Write class skeletons (constructors, method signatures)
  - No implementation yet, just structure

  Thu (Implement Core):
  - Implement ParkingSpot (park, remove, canFit logic)
  - Implement ParkingLevel (findAvailableSpot)
  - Test these in isolation

  Fri (Implement Main):
  - Implement ParkingLot (parkVehicle, removeVehicle)
  - Implement ParkingTicket (calculateFee)
  - Test full flow

  Sat (Polish):
  - Write tests (ParkingLot.test.js)
  - Write README (design decisions, approach, complexity)
  - Push to GitHub

  ---
  Don't Overthink

  - Start simple
  - Make it work first
  - Optimize later (if needed)
  - No AI help - think through it yourself

