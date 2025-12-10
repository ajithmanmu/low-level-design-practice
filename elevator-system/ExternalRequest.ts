import { Direction } from "./Direction";
import { Request, Type } from "./Request";

export class ExternalRequest implements Request {
    type: Type;
    direction: Direction

    sourceFloor: number;

    constructor(direction:Direction, floor:number) {
        this.type = Type.EXTERNAL;
        this.direction = direction
        this.sourceFloor = floor;
    }

    getFloor() {
        return this.sourceFloor;
    }

    getDirection() {
        return this.direction;
    }
}