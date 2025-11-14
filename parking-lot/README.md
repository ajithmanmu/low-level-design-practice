# Parking Lot System - Low Level Design

## Problem Statement

A Parking Lot consists of multiple Parking Levels. We will have 3 Parking levels.

A Parking Level consists of multiple Parking Spots. We will have 10 Parking Spots per SpotType.

A Parking Spot can be of different types - SpotType - MOTORCYCLE, COMPACT, LARGE

---

## Class Design

### Vehicle
We will associate the License Plate and Vehicle Type to the class. The VehicleType can be MOTORCYCLE, CAR or TRUCK.

### ParkingLot
Associate number of levels and ParkingLevels objects array

**Functions:**
- `parkVehicle(vehicle)` → For this loop through all the levels and see if we can park in any level. If a spot is found then assign the spot and create a ticket and return.
- `removeVehicle(ticket)` → Release the spot and calculate the cost
- `getAvailableSpots()` → Gets a count of all available spots in all levels

### ParkingLevel
Associate level number and ParkingSpots objects array

**Functions:**
- `parkVehicle(vehicle)` → Find an available spot and park. Loop through the spots array, remove out the not available spots, and get the spots that matches with the vehicle type. i.e these are the priority spot type mappings for each vehicle:
  - MOTORCYCLE - Can park in MOTORCYCLE, COMPACT, LARGE
  - CAR - Can park in COMPACT, LARGE
  - TRUCK - Can park in LARGE

### ParkingSpot
We will associate spotNumber, spotType, currentVehicle

**Functions:**
- `park(vehicle)` → Set the currentVehicle to the vehicle
- `isAvailable()` → Check if there is any currentVehicle
- `removeVehicle()` → Unsets the currentVehicle
- `canFitVehicle()` → util function to check if a spot can fit a given vehicle

### ParkingTicket
Associate TicketId, Vehicle Object, Spot Object, entryTime

**Functions:**
- `calculateFee()` → Calculate the total park time (endTime-entryTime) and return the cost

---

## Key Design Decision: Priority-Based Spot Assignment

The idea here is we should try to find the most suited spot type for a vehicle before checking for larger spot types so as to optimize space and can efficiently serve larger vehicle types. So find the ordered priority spot types list for a particular vehicle type. And then loop through them and as soon as you find a eligible spot assign it. Once assigned create a ticket with the assigned Spot and Vehicle. And then finally return the Ticket back to client.

---

## How to Run

```bash
npx ts-node test.ts
```


Other Notes

Tiered pricing. - increased pricing after x hours. can have different fee calculation strategy. ParkingTicket class level -  Can be done in calculateFee logic. 
Billing - Supports multiple payment modes. ParkingTicket can have a Paymenmt Object assosciated.