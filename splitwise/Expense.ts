import { Group } from "./Group";
import { User } from "./User";

export class Expense {
    id: string;
    amount: number;
    group: Group;
    paidBy: User;
    date: any;
    description: string;
    splits: [];

    constructor(amount, group, paidBy, description, splits) {
        this.id = crypto.randomUUID();
        this.amount = amount;
        this.group = group;
        this.paidBy = paidBy;
        this.date = Date.now();
        this.description = description;
        this.splits = splits;
    }
}