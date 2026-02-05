import { Transaction, Status } from "./Transaction";

export class Bank {
    accounts: any;
    cards: any;

    constructor(accounts, cards) {
        this.accounts = accounts;
        this.cards = cards;// <cardNumber: Card>
    }
    authenticate(pin, cardNumber) {
        const card = this.cards.get(cardNumber);
        if(!card) throw new Error('Card does not exist');
        if(card.attempts >= 3) return 'MAX_ATTEMPTS_EXCEEDED';
        if(card.pin === pin) return 'SUCCESS';
        card.attempts+=1;
        return 'FAILURE';
    }
    deposit(accountId, amount) {
        const account = this.accounts.get(accountId);
        if(!account) throw new Error('Account does not exist');
        const transaction = new Transaction(Status.DEPOSIT, account, amount);
        account.transactions.push(transaction);
        account.balance+=amount;
    }
    withdraw(accountId, amount) {
        const account = this.accounts.get(accountId);
        if(!account) throw new Error('Account does not exist');
        if(account.balance < amount) throw new Error('Not enough balance');
        const transaction = new Transaction(Status.WITHDRAW, account, amount);
        account.transactions.push(transaction);
        account.balance-=amount;
    }
    getBalance(accountId) {
        const account = this.accounts.get(accountId);
        if(!account) throw new Error('Account does not exist');
        return account.balance;
    }
}