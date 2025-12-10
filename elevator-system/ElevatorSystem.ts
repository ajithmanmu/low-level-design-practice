import { Direction } from "./Direction";
import { ExternalRequest } from "./ExternalRequest";
import { InternalRequest } from "./InternalRequest";
export class ElevatorSystem {
    floors: number;
    elevatorMap: any;
    queue: any[];

    constructor(floors: number, elevators: any[]) {
        this.floors = floors;
        this.elevatorMap = new Map();
        for(let el of elevators) {
            this.elevatorMap.set(el.id, el)
        }
        this.queue = [];
    }

    assignElevator() {
        const request = this.queue.shift();
        if (!request) return null;

        const floor = request.getFloor();
        const direction = request.getDirection();
        
        let selectedElevator;
        let minDist = Infinity;
        for(let [elevatorId, elevator] of this.elevatorMap) {
            if(elevator.isMoving && elevator.direction === direction) {
                if(direction === Direction.UP) {
                    if(elevator.currentFloor < floor) {
                        let dist = Math.abs(floor-elevator.currentFloor);
                        if(dist < minDist) {
                            minDist = dist;
                            selectedElevator = elevator;
                        }
                    }
                } else if(direction === Direction.DOWN) {
                    if(elevator.currentFloor > floor) {
                        let dist = Math.abs(floor-elevator.currentFloor);
                        if(dist < minDist) {
                            minDist = dist;
                            selectedElevator = elevator;
                        }
                    }
                }
            }
        }
        if(selectedElevator) return selectedElevator;

        minDist = Infinity;
        for(let [elevatorId, elevator] of this.elevatorMap) {
            if(!elevator.isMoving) {
                let dist = Math.abs(floor-elevator.currentFloor);
                if(dist < minDist) {
                    minDist = dist;
                    selectedElevator = elevator;
                }
            }
        }

        return selectedElevator;
    }

    requestElevator(floor: number, direction: Direction) {
        const externalRequest = new ExternalRequest(direction, floor)
        this.queue.push(externalRequest);
        let elevator = this.assignElevator();
        elevator.setDestination(floor);
        // elevator.isMoving = true;
    }

    selectFloor(elevatorId: number, destinationFloor: number) {
        
        let elevator = this.elevatorMap.get(elevatorId);
        const internalRequest = new InternalRequest(elevator, destinationFloor)
        elevator.setDestination(internalRequest.getFloor());
        // elevator.isMoving = true;
    }

    step() {
        for(let [elevatorId, elevator] of this.elevatorMap) {
            // Check if elevator has any destinations to go
            if(elevator.destinationFloor.length > 0) {
                let destinations = elevator.destinationFloor;
                let currentFloor = elevator.currentFloor;
                let nextDestination = destinations[0];
                if(currentFloor > nextDestination) {
                    elevator.moveDown()
                } else if(currentFloor < nextDestination)  {
                    elevator.moveUp();
                }

                if(elevator.currentFloor === nextDestination) {
                    destinations.shift();
                }
                if(destinations.length === 0) {
                    // elevator.isMoving = false;
                    // elevator.direction = Direction.IDLE;
                    elevator.stop();
                }
            }
        }
    }

}