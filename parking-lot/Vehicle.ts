export enum VehicleType {
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    TRUCK = "TRUCK",
}

export class Vehicle {
    vehicleType : VehicleType;
    license: string;

    constructor(vehicleType: VehicleType, license: string) {
        this.vehicleType = vehicleType;
        this.license = license;
    }
}