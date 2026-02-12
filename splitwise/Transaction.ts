import { User } from "./User";

export class Transaction {
    id: string;
    from: User;
    to: User;
    amount: number;
    date: any;

    constructor(from, to, amount) {
        this.id = crypto.randomUUID();
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.date = Date.now();
    }
}
// TODO - how do we expose this info - maybe on a User level - getTransactions ?