import { SpotType, ParkingSpot } from './ParkingSpot';
import { Vehicle } from './Vehicle';

export class ParkingLevel {
    levelNumber: number;
    spots : ParkingSpot[]

    constructor(levelNumber: number, spots: ParkingSpot[]) {
        this.levelNumber = levelNumber;
        this.spots = spots;
    }

    findAvailableSpot(vehicle: Vehicle):ParkingSpot | undefined {
        const spotPriority = {
            MOTORCYCLE: [SpotType.MOTORCYCLE, SpotType.COMPACT, SpotType.LARGE],
            CAR: [SpotType.COMPACT, SpotType.LARGE],
            TRUCK: [SpotType.LARGE]
        };

        const priorityList = spotPriority[vehicle.vehicleType];
        for(let spotType of priorityList) {
            const spot = this.spots.find((spot) => {
                const isAvailable = spot.isAvailable();
                return spot.spotType === spotType && isAvailable ;
            });
            return spot;
        }
        return undefined;
    }

    parkVehicle(vehicle: Vehicle): ParkingSpot | null {
        const spot = this.findAvailableSpot(vehicle);
        if(!spot) {
            return null;
        }
        spot.park(vehicle);
        return spot;
    }
}