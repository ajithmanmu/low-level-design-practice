import { Split } from "./Split";
import { User } from "./User";

export class EqualSplit implements Split {
    user: User;
    totalAmount: number;
    totalMembers: number;

    constructor(user, totalAmount, totalMembers) {
        this.user = user;
        this.totalAmount = totalAmount;
        this.totalMembers = totalMembers;
    }
    getAmount() {
        return this.totalAmount/this.totalMembers;
    }
}