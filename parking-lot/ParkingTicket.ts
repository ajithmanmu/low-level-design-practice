class ParkingTicket {
    ticketId: number;
    vehicle:any;
    spot: any;
    entryTime:string;
    exitTime: string;
    cost: number;

    constructor(ticketId, vehicle, spot, entryTime) {
        this.ticketId = ticketId;
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = entryTime;
    }

    calculateFee() {

    }
}