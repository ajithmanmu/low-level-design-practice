# Parking Lot System - Progress Tracker

## Project Info
- **Started:** Nov 12, 2025
- **Target Completion:** Nov 16, 2025 (Sat)
- **Status:** In Progress - Design Phase

---

## Timeline

### **Wed, Nov 13 - Design Phase** ✅
**Goal:** Create class skeletons

**Completed:**
- ✅ Created `Vehicle.ts` with VehicleType enum
- ✅ Created `ParkingSpot.ts` with SpotType enum
- ✅ Created `ParkingLevel.ts`
- ✅ Created `ParkingTicket.ts`
- ✅ Created `ParkingLot.ts`
- ✅ Defined method signatures for all classes

**Design Decisions:**
- Using TypeScript for type safety
- Enums for VehicleType and SpotType (good for type checking)
- Ticket stores entry time as string (will need to convert for fee calculation)

**Issues Found:**
- ParkingTicket line 11: Typo - `this,vehicle` should be `this.vehicle`
- ParkingLot line 4: Typo - `contructor` should be `constructor`
- ParkingSpot missing: Need property to track current vehicle (occupied state)
- ParkingLevel: Need to store actual ParkingSpot instances (array), not just counts

---

### **Thu, Nov 14 - Implementation: Core Logic** (NEXT)
**Goal:** Implement ParkingSpot and ParkingLevel

**Tasks:**
- [ ] Fix typos in ParkingTicket and ParkingLot
- [ ] Add `currentVehicle` property to ParkingSpot
- [ ] Implement `ParkingSpot.canFitVehicle(vehicle)` - logic for spot compatibility
- [ ] Implement `ParkingSpot.park(vehicle)` - assign vehicle to spot
- [ ] Implement `ParkingSpot.removeVehicle()` - free spot
- [ ] Implement `ParkingSpot.isAvailable()` - check if spot is free
- [ ] Change ParkingLevel to store array of ParkingSpot instances
- [ ] Implement `ParkingLevel.findAvailableSpot(vehicle)` - search through spots
- [ ] Implement `ParkingLevel.parkVehicle(vehicle)` - use findAvailableSpot

**Test as you go:**
- Test ParkingSpot methods in isolation
- Test ParkingLevel finding spots for different vehicle types

---

### **Fri, Nov 15 - Implementation: Main Classes**
**Goal:** Implement ParkingLot and ParkingTicket

**Tasks:**
- [ ] Change ParkingLot to store array of ParkingLevel instances
- [ ] Implement `ParkingLot.parkVehicle(vehicle)` - iterate through levels
- [ ] Implement `ParkingLot.removeVehicle(ticket)` - calculate fee, free spot
- [ ] Implement `ParkingLot.getAvailableSpots()` - count across all levels
- [ ] Implement `ParkingTicket.calculateFee()` - time diff × $5/hour
- [ ] Handle edge cases: parking lot full, invalid ticket

**Test full flow:**
- Park vehicle → get ticket
- Remove vehicle → calculate correct fee
- Try parking when full → return null

---

### **Sat, Nov 16 - Testing & Documentation**
**Goal:** Write tests, README, push to GitHub

**Tasks:**
- [ ] Create `ParkingLot.test.ts`
- [ ] Test scenarios:
  - Park motorcycle (gets motorcycle spot)
  - Park car (gets compact spot)
  - Park truck (gets large spot)
  - Park when full (returns null)
  - Fee calculation (2 hours = $10)
  - Multiple vehicles across levels
- [ ] Write README.md:
  - Problem description
  - Design decisions
  - Class structure
  - Time/space complexity
  - How to run
- [ ] Push to GitHub
- [ ] (Optional) Compare with ONE article

---

## Design Decisions Log

### **Class Structure:**
```
Vehicle
  - vehicleType: VehicleType (MOTORCYCLE, CAR, TRUCK)
  - license: string

ParkingSpot
  - spotType: SpotType (MOTORCYCLE, COMPACT, LARGE)
  - spotNumber: number
  - currentVehicle: Vehicle | null (MISSING - NEEDS TO BE ADDED)

ParkingLevel
  - levelNumber: number
  - spots: ParkingSpot[] (NEEDS TO CHANGE FROM spotsPerType)

ParkingTicket
  - ticketId: number
  - vehicle: Vehicle
  - spot: ParkingSpot
  - entryTime: string (consider Date object?)
  - exitTime: string
  - cost: number

ParkingLot
  - numLevels: number
  - levels: ParkingLevel[] (NEEDS TO BE ADDED)
```

### **Spot Assignment Rules:**
- Motorcycle → Try MOTORCYCLE spot first, then COMPACT, then LARGE
- Car → Try COMPACT spot first, then LARGE
- Truck → LARGE spot only

### **Fee Calculation:**
- $5 per hour
- Calculate: (exitTime - entryTime) in hours × 5

---

## Questions / Decisions Needed

**Time Handling:**
- Currently using string for entryTime/exitTime
- Should we use Date objects instead? (Easier for calculations)
- Decision: Will decide during Thu implementation

**Spot Assignment Priority:**
- Should we always assign smallest fitting spot?
- Decision: Yes - saves larger spots for bigger vehicles

**Error Handling:**
- What to return when parking lot is full? null or throw error?
- Decision: Return null (easier to handle)

---

## Code Review Notes

### **Good Things:**
- ✅ Clean class structure
- ✅ Using TypeScript enums (type safety)
- ✅ Method signatures match requirements
- ✅ Separation of concerns (each class has clear responsibility)

### **Needs Fixing:**
1. **ParkingTicket.ts line 11:** `this,vehicle = vehicle;` → `this.vehicle = vehicle;`
2. **ParkingLot.ts line 4:** `contructor` → `constructor`

### **Missing Properties:**
1. **ParkingSpot:** Need `currentVehicle: Vehicle | null` to track occupancy
2. **ParkingLevel:** Need `spots: ParkingSpot[]` instead of `spotsPerType: any`
3. **ParkingLot:** Need `levels: ParkingLevel[]` to store level instances

### **Implementation Notes for Thu:**
- ParkingSpot.canFitVehicle() logic:
  ```
  MOTORCYCLE spot → only MOTORCYCLE vehicle
  COMPACT spot → MOTORCYCLE or CAR
  LARGE spot → any vehicle
  ```
- ParkingLevel should create ParkingSpot instances in constructor
- ParkingLot should create ParkingLevel instances in constructor

---

## Next Session Prep

**Before starting Thu:**
1. Fix the 2 typos
2. Add missing properties to classes
3. Review this tracker
4. Start with ParkingSpot implementation

**Focus:** Get ParkingSpot fully working first, then ParkingLevel

---

**Last Updated:** Wed, Nov 13, 2025 - After design review
