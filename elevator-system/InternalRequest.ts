import { Direction } from "./Direction";
import { Elevator } from "./Elevator";
import { Request, Type } from "./Request";

export class InternalRequest implements Request {
    type: Type;
    direction: Direction

    destinationFloor: number;
    elevator: Elevator;

    constructor(elevator:Elevator, floor:number) {
        this.type = Type.INTERNAL;
        this.elevator = elevator;
        this.destinationFloor = floor;
        if(this.destinationFloor > elevator.currentFloor) {
            this.direction = Direction.UP
        } else {
            this.direction = Direction.DOWN
        }
    }

    getFloor() {
        return this.destinationFloor;
    }

    getDirection() {
        return this.direction;
    }

    getElevator() {
        return this.elevator;
    }

}