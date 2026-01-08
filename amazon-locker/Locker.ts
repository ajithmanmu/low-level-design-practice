import { Slot, SlotSize } from "./Slot";
import { Token } from "./Token";

const fallbackSlots: Record<string, string[]> = {
    "SMALL" : ["MEDIUM", "LARGE"],
    "MEDIUM" : ["LARGE"],
}
export class Locker {
    slots: Slot[];
    tokensMap: Map<string, Token>;

    constructor(slots: Slot[]) {
        this.slots = slots;
        this.tokensMap = new Map();
    }

    findAvailableSlot(item: { size: SlotSize }) {
        // loop through slots and find available slot that matches size
        for(let slot of this.slots) {
            if(!slot.occupied && slot.size === item.size) {
                return slot;
            }
        }

        // Check fallback sizes;
        let fallbacks = fallbackSlots[item.size];
        if(fallbacks) {
            for(let fallbackslot of fallbacks) {
                for(let slot of this.slots) {
                    if(!slot.occupied && slot.size === fallbackslot) {
                        return slot;
                    }
                }
            }
        }
        return null;
        
    }

    depositPackage(item: { size: SlotSize }) {
        const slot = this.findAvailableSlot(item);
        if(!slot) throw new Error('No slot found');

        // Update slot 
        slot.setOccupied(true);
        // generate code
        const accessToken = new Token(slot);
        this.tokensMap.set(accessToken.getCode(), accessToken);
        
        return {accessToken, slot};
    }

    pickup(code: string) {
        if(!code) throw new Error('Invalid code');
        
        const token = this.tokensMap.get(code);
        if(!token) throw new Error('Invalid code');

        const slot = token.getSlotIfAvailable();
        if(!slot){
            this.clearPackage(token);
            throw new Error('Token expired');
        } 

        this.clearPackage(token);

        return slot;
    }

    clearPackage(token: Token) {
        if(!token) throw new Error('Invalid code');

        const slot = token.getSlot();

        // update slot
        slot.setOccupied(false);
        // remove token
        this.tokensMap.delete(token.getCode());

    }

}