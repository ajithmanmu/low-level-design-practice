import { IdleState } from "./IdleState";
import { State } from "./State";
import { CashDispenser } from "./CashDispenser";

export class AuthenticatedState implements State {
    constructor(){

    }
    insertCard(atm, card) {
        throw new Error('invalid operation');
    }
    enterPin() {
        throw new Error('invalid operation');
    }
    withdraw(atm, accountId, amount) {
            if(atm.currentBalance < amount) throw new Error('not enough cash');
            atm.bank.withdraw(accountId, amount);
            try {
                let dispense = atm.calculate(amount);
                return dispense;
            } catch(err) {
                atm.bank.deposit(accountId, amount);
                throw err;
            }
    }
    deposit(atm, accountId, amount) {
        try {
            atm.bank.deposit(accountId, amount)
            atm.currentBalance+=amount;
            // Update the denominmations map as well, but we ned to know the denominations of the amount first
            return 'success';
        } catch(err) {
            throw new Error(err);
        }
    }
    getBalance(atm, accountId) {
        try {
            let res = atm.bank.getBalance(accountId)
            return res;
        } catch(err) {
            throw new Error(err);
        }
    }
    ejectCard(atm) {
        atm.insertedCard = null;
        atm.setState(new IdleState());
    }
}