import { Expense } from "./Expense";
import { User } from "./User";

export class Group {
    id: string;
    name: string;
    members: User[];
    expenses: Expense[];

    constructor(name) {
        this.id = crypto.randomUUID();;
        this.name = name;
        this.members = [];
        this.expenses = [];
    }

    addMember(member) {
        this.members.push(member);
    }

    addExpense(expense) {
        this.expenses.push(expense);
    }

}