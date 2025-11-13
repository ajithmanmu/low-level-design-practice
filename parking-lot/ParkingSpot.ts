import { Vehicle } from './Vehicle';

export enum SpotType {
    MOTORCYCLE = "MOTORCYCLE",
    COMPACT = "COMPACT",
    LARGE = "LARGE",
}

export class ParkingSpot {
    spotType: SpotType;
    spotNumber: number;
    currentVehicle: Vehicle | null;

    constructor(spotType: SpotType, spotNumber: number) {
        this.spotType = spotType;
        this.spotNumber = spotNumber;
        this.currentVehicle = null;
    }

    park(vehicle: Vehicle) {
        this.currentVehicle = vehicle;
    }

    removeVehicle() {
        this.currentVehicle = null;
    }

    isAvailable():boolean {
        return !this.currentVehicle;
    }

    private getAllowedVehiclesList(spotType: SpotType) {
        const mapping = {
            MOTORCYCLE: ["MOTORCYCLE"],
            COMPACT: ["MOTORCYCLE", "CAR"],
            LARGE: ["MOTORCYCLE", "CAR", "TRUCK"]
        };
        return mapping[spotType];
    }

    canFitVehicle(vehicle: Vehicle):boolean {
        const allowedVehicles = this.getAllowedVehiclesList(this.spotType);
        const allowed = allowedVehicles.find((vehicleType)=>vehicleType === vehicle.vehicleType)
        return !!allowed;
    }
}