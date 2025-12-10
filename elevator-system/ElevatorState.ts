import { Elevator } from "./Elevator";

export interface ElevatorState {
    moveUp(elevator:Elevator):void;
    moveDown(elevator:Elevator):void;
    openDoor(elevator:Elevator):void;
    closeDoor(elevator:Elevator):void;
}