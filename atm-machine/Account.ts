export class Account {
    balance: number;
    accountId: number;
    transactions: [];
    
    constructor(accountId) {
        this.balance = 0;
        this.accountId = accountId;
        this.transactions = [];
    }
}