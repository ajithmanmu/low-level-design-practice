import { Split } from "./Split";
import { User } from "./User";

export class PercentSplit implements Split {
    user: User;
    totalAmount: number;
    percent: number;

    constructor(user, totalAmount, percent) {
        this.user = user;
        this.totalAmount = totalAmount;
        this.percent = percent;
    }
    getAmount() {
        return (this.totalAmount * this.percent)/100;
    }
}