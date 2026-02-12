import { Split } from "./Split";
import { User } from "./User";

export class ExactSplit implements Split {
    user: User;
    amount: number;
    
    constructor(user, amount) {
        this.user = user;
        this.amount = amount;
    }
    getAmount() {
        return this.amount;
    }
}