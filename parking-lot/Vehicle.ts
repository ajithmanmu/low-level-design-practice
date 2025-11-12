enum VehicleType {
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    TRUCK = "TRUCK",
}

class Vehicle {
    vehicleType : VehicleType;
    license: string;

    constructor(vehicleType, license) {
        this.vehicleType = vehicleType;
        this.license = license;
    }
}