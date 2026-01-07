export enum SlotSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
}

export class Slot {
    id: number;
    occupied: boolean;
    size: SlotSize;

    constructor(id, size:SlotSize) {
        this.id = id;
        this.occupied = false;
        this.size = size;
        // this.package = null;
    }

    setOccupied(occupied) {
        this.occupied = occupied;
    }
}