import { Elevator } from "./Elevator";
import { ElevatorState } from "./ElevatorState";
import { MovingDownState } from "./MovingDownState";
import { MovingUpState } from "./MovingUpState";
import { Direction } from "./Direction";

export class IdleState implements ElevatorState {

    constructor(elevator:Elevator) {
        elevator.isMoving = false;
        elevator.direction = Direction.IDLE;
    }

    moveUp(elevator:Elevator) {
        if(elevator.destinationFloor.length == 0) return;
        elevator.setState(new MovingUpState(elevator));
        elevator.currentFloor+=1;
        // elevator.isMoving = true;
        // elevator.direction = Direction.UP;
    }

    moveDown(elevator:Elevator) {
        if(elevator.destinationFloor.length == 0) return;
        elevator.setState(new MovingDownState(elevator));
        elevator.currentFloor-=1;
        // elevator.isMoving = true;
        // elevator.direction = Direction.DOWN;
    }
    
    openDoor(elevator:Elevator) {
        // Future implementation
    }

    closeDoor(elevator:Elevator) {
        // Future implementation
    }
}