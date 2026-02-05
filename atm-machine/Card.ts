import { Account } from "./Account";

export class Card {
    cardNumber: number;
    account: Account;
    attempts: number;
    pin: number | null;

    constructor(cardNumber, account) {
        this.cardNumber = cardNumber;
        this.account = account;
        this.attempts = 0;
        this.pin = null;
    }
}