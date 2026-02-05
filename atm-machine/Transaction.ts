import { Account } from "./Account";

export enum Status {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    TRANSFER = 'TRANSFER'
}

export class Transaction {
    transactionId: number;
    type: string;
    account: Account;
    amount: number;
    timestamp: Date;

    constructor(type, account, amount) {
        this.transactionId = Date.now();
        this.type = type;
        this.account = account;
        this.amount = amount;
        this.timestamp = new Date();
    }
}