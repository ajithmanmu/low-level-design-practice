
export class Elevator {
    id: number;
    currentFloor: number;
    destinationFloor: number[];
    isMoving: boolean
    direction: string | null;
    isOpen: boolean

    constructor(id:number) {
        this.id = id;
        this.currentFloor = 0;
        this.isMoving = false;
        this.direction = null;
        this.isOpen = false;
        this.destinationFloor = [];
    }

    setDestination(floor:number) {
        this.destinationFloor.push(floor);
    }

    moveUp() {
        if(this.destinationFloor.length == 0) return;
        // while(this.destinationFloor !== this.currentFloor) {
            // const nextDestination = this.destinationFloor[0];
            // if(nextDestination === this.currentFloor) this.destinationFloor.shift();
            this.isMoving = true;
            this.direction = "up";
            this.currentFloor+=1;
            
        // }
    }

    moveDown() {
        if(this.destinationFloor.length == 0) return;
        // const nextDestination = this.destinationFloor[0];
        // if(nextDestination === this.currentFloor) this.destinationFloor.shift();
        // while(this.destinationFloor !== this.currentFloor) {
            this.isMoving = true;
            this.direction = "down";
            this.currentFloor-=1;
        // }
    }
}