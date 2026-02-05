import { Bank } from "./Bank";
import { IdleState } from "./IdleState";
import { State } from "./State";

export class ATMSystem {
    currentBalance: number; 
    denominations: Map<number, number>;
    state: State;
    insertedCard: any;
    bank: Bank;

    constructor(denominations, bank) {
        this.currentBalance = 0;
        this.denominations = denominations; // <deno: count>
        this.state = new IdleState();
        this.insertedCard = null;
        this.bank = bank;
    }
    insertCard(cardNumber) {
        this.state.insertCard(this, cardNumber);
    }
    enterPin(pin) {
        this.state.enterPin(this, pin);
    }
    withdraw(accountId, amount) {
        return this.state.withdraw(this, accountId, amount);
    }
    deposit(accountId, amount) {
        this.state.deposit(this, accountId, amount);
    }
    getBalance(accountId) {
        return this.state.getBalance(this, accountId);
    }
    ejectCard() {
        this.state.ejectCard(this);
    }
    setState(state) {
        this.state = state;
    }

    calculate(amount) {
        // atm.denominations, currentBalance
        // sort by high to low
        let denominationsArray = Array.from(this.denominations).sort((a,b)=>Number(b[0])-Number(a[0]));

        let currAmount = amount;
        let dispense = [];
        let updates = [];
        for(let deno of denominationsArray) {
            let denoAmount = Number(deno[0]);
            let count = deno[1];
            while(denoAmount <= currAmount && count > 0) {
                currAmount-=denoAmount;
                count-=1;
                dispense.push(denoAmount);
            }
            updates.push([denoAmount, count])
            // this.denominations.set(denoAmount, count);
        }
        if(currAmount > 0) throw new Error('not enough cash to dispense');
        for(let update of updates) {
            this.denominations.set(update[0], update[1]);
        }
        this.currentBalance-=amount;
        return dispense;
    }
}