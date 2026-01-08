import { Slot } from "./Slot";

const EXPIRATION_DAYS = 5;

export class Token {
    code: string;
    expiry: number;
    slot: Slot;

    constructor(slot: Slot) {
        this.code = crypto.randomUUID();
        this.expiry = Date.now() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        this.slot = slot;
    }

    getCode() {
        return this.code;
    }

    getSlotIfAvailable() {
        if(Date.now() > this.expiry) return null;
        return this.slot;
    }

    getSlot() {
        return this.slot;
    }
}