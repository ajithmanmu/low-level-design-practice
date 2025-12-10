import { Direction } from "./Direction";
import { ElevatorState } from "./ElevatorState";
import { IdleState } from "./IdleState";

export class Elevator {
    id: number;
    currentFloor: number;
    destinationFloor: number[];
    isMoving: boolean
    direction: Direction;
    isOpen: boolean
    state: ElevatorState

    constructor(id:number) {
        this.id = id;
        this.currentFloor = 0;
        this.isMoving = false;
        this.direction = Direction.IDLE;
        this.isOpen = false;
        this.destinationFloor = [];
        this.state = new IdleState(this);
    }

    setState(state:ElevatorState) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    setDestination(floor:number) {
        this.destinationFloor.push(floor);
    }

    moveUp() {
        // if(this.destinationFloor.length == 0) return;
        //     this.isMoving = true;
        //     this.direction = Direction.UP;
        //     this.currentFloor+=1;
        this.state.moveUp(this);
    }

    moveDown() {
        // if(this.destinationFloor.length == 0) return;
        //     this.isMoving = true;
        //     this.direction = Direction.DOWN;
        //     this.currentFloor-=1;
        this.state.moveDown(this);
    }

    stop() {
        this.setState(new IdleState(this));
    }

}