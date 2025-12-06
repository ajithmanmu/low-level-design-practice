
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
        let {floor, direction} = request;
        
        let selectedElevator;
        let minDist = Infinity;
        for(let [elevatorId, elevator] of this.elevatorMap) {
            if(elevator.isMoving && elevator.direction === direction) {
                if(direction === "up") {
                    if(elevator.currentFloor < floor) {
                        let dist = Math.abs(floor-elevator.currentFloor);
                        if(dist < minDist) {
                            minDist = dist;
                            selectedElevator = elevator;
                        }
                    }
                } else if(direction === "down") {
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

    requestElevator(floor: number, direction: string) {
        this.queue.push({
            floor,
            direction
        })
        let elevator = this.assignElevator();
        elevator.setDestination(floor);
        elevator.isMoving = true;
        // return elevator;
    }

    selectFloor(elevatorId: number, destinationFloor: number) {
        let elevator = this.elevatorMap.get(elevatorId);
        elevator.setDestination(destinationFloor);
        elevator.isMoving = true;
    }

    step() {
        for(let [elevatorId, elevator] of this.elevatorMap) {
            if(elevator.isMoving) {
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
                    elevator.isMoving = false;
                    elevator.direction = null;
                }
            }
        }
    }

}