import { Elevator } from "./Elevator";
import { ElevatorState } from "./ElevatorState";
import { MovingDownState } from "./MovingDownState";
import { Direction } from "./Direction";

export class MovingUpState implements ElevatorState {

    constructor(elevator:Elevator) {
        elevator.isMoving = true;
        elevator.direction = Direction.UP;
    }

    moveUp(elevator:Elevator) {
        if(elevator.destinationFloor.length == 0) return;
        elevator.currentFloor+=1;
    }

    moveDown(elevator:Elevator) {
        if(elevator.destinationFloor.length == 0) return;
        elevator.setState(new MovingDownState(elevator));
        elevator.currentFloor-=1;
        // elevator.direction = Direction.DOWN;
    }
    
    openDoor(elevator:Elevator) {
        // Future implementation
    }

    closeDoor(elevator:Elevator) {
        // Future implementation
    }
}