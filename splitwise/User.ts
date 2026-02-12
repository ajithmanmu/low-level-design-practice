export class User {
    id: string;
    name: string;
    balances: any;

    constructor(name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.balances = new Map(); // <user: amount> // + for receive, - for giving
    }
    updateBalance(user, amount) {
        if(!this.balances.has(user)) {
            this.balances.set(user, 0);
        }
        this.balances.set(user, this.balances.get(user) + amount);
    }
    getBalance(user) {
        if(!this.balances.has(user)) {
            return 0;
        }
        return this.balances.get(user)
    }
}