class ParkingLevel {
    levelNumber: number;
    spots : ParkingSpot[]

    constructor(levelNumber, spots) {
        this.levelNumber = levelNumber;
        this.spots = spots;
    }

    findAvailableSpot(vehicle):ParkingSpot | undefined {
        // Fetch available spots from the spots array ?
        const spot = this.spots.find((spot) => {
            const canFit = spot.canFitVehicle(vehicle)
            const isAvailable = spot.isAvailable();
            return canFit && isAvailable;
        });
        return spot;
    }

    parkVehicle(vehicle): ParkingSpot | null {
        const spot = this.findAvailableSpot(vehicle);
        if(!spot) {
            return null;
        }
        spot.park(vehicle);
        return spot;
    }
}