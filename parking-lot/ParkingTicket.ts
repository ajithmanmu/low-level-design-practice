import { Vehicle } from './Vehicle';
import { ParkingSpot } from './ParkingSpot';

export class ParkingTicket {
    ticketId: string;
    vehicle: Vehicle;
    spot: ParkingSpot;
    entryTime: number;
    exitTime?: number;
    cost?: number;
    
    private readonly PRICE_PER_HOUR = 5;

    constructor(ticketId: string, vehicle: Vehicle, spot: ParkingSpot, entryTime: number) {
        this.ticketId = ticketId;
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = entryTime;
    }

    calculateFee() {
        const parkedTime = Math.floor((Date.now() - this.entryTime)/(1000*60*60));
        return this.PRICE_PER_HOUR * parkedTime;
    }
}