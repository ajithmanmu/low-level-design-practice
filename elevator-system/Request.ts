import { Direction } from "./Direction"
export enum Type {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL',
}

export interface Request {
    type: Type,
    direction: Direction

    getDirection():Direction;
}

