import { Slot } from "./Slot";
import { Token } from "./Token";

const fallbackSlots = {
    "SMALL" : ["MEDIUM", "LARGE"],
    "MEDIUM" : ["LARGE"],
}
export class Locker {
    slots: Slot[];
    tokensMap: any;

    constructor(slots) {
        this.slots = slots;
        this.tokensMap = new Map();
    }

    findAvailableSlot(item) {
        // loop through slots and find available slot that matches size
        for(let slot of this.slots) {
            if(!slot.occupied && slot.size === item.size) {
                return slot;
            }
        }

        // Check fallback sizes;
        let fallbacks = fallbackSlots[item.size];
        for(let fallbackslot of fallbacks) {
            for(let slot of this.slots) {
                if(!slot.occupied && slot.size === fallbackslot) {
                    return slot;
                }
            }
        }

        return null;
        
    }

    depositPackage(item) {
        const slot = this.findAvailableSlot(item);
        if(!slot) return 'No slot found';

        // Update slot 
        slot.setOccupied(true);
        // generate code
        const accessToken = new Token(slot);
        this.tokensMap.set(accessToken.getCode(), accessToken);
        
        return {accessToken, slot};
    }

    pickup(code) {
        if(!code) return 'Invalid code';
        
        const token = this.tokensMap.get(code);
        if(!token) return 'Invalid code';

        const slot = token.getSlotIfAvailable();
        if(!slot) return 'Token expired'

        // update slot
        slot.setOccupied(false);
        // remove token
        this.tokensMap.delete(code);

        return slot;
    }

    removeExpiredPackage(code) {

    }
}