import { ParkingLevel } from './ParkingLevel';
import { ParkingTicket } from './ParkingTicket';
import { Vehicle } from './Vehicle';

export class ParkingLot {
    numLevels: number;
    levels: ParkingLevel[];

    constructor(levels: ParkingLevel[]) {
        this.levels = levels;
        this.numLevels = levels.length;
    }

    parkVehicle(vehicle: Vehicle): ParkingTicket | null {
        for(let level of this.levels) {
            let spot = level.parkVehicle(vehicle);
            if(spot) {
                const ticketId = crypto.randomUUID();
                const entryTime = Date.now();
                const ticket = new ParkingTicket(ticketId, vehicle, spot, entryTime);
                return ticket;
            }
        }
        return null;
    }

    removeVehicle(ticket: ParkingTicket): number {
        ticket.spot.removeVehicle();
        const price = ticket.calculateFee();
        return price;
    }

    getAvailableSpots(): number {
        let count = 0;
        for(let level of this.levels) {
            let spots = level.spots;
            for(let spot of spots) {
                if(spot.isAvailable()) {
                    count+=1;
                }
            }
        }
        return count;
    }
}