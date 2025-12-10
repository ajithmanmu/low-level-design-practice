import { Elevator } from "./Elevator";
import { ElevatorState } from "./ElevatorState";
import { MovingUpState } from "./MovingUpState";
import { Direction } from "./Direction";

export class MovingDownState implements ElevatorState {
    
    constructor(elevator:Elevator) {
        elevator.isMoving = true;
        elevator.direction = Direction.DOWN;
    }

    moveUp(elevator:Elevator) {
        if(elevator.destinationFloor.length == 0) return;
        elevator.setState(new MovingUpState(elevator));
        elevator.currentFloor+=1;
        // elevator.direction = Direction.UP;
    }

    moveDown(elevator:Elevator) {
        if(elevator.destinationFloor.length == 0) return;
        elevator.currentFloor-=1;
    }
    
    openDoor(elevator:Elevator) {
        // Future implementation
    }

    closeDoor(elevator:Elevator) {
        // Future implementation
    }
}