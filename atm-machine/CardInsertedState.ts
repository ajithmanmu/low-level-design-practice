import { AuthenticatedState } from "./AuthenticatedState";
import { IdleState } from "./IdleState";
import { State } from "./State";

export class CardInsertedState implements State {
    constructor(){
    }
    insertCard(atm, card) {
        throw new Error('invalid operation');   
    }
    enterPin(atm, pin) {
        const authCheckResult = atm.bank.authenticate(pin, atm.insertedCard);
        if(authCheckResult === 'SUCCESS'){
            atm.setState(new AuthenticatedState());
            return;
        }
        if(authCheckResult === 'MAX_ATTEMPTS_EXCEEDED'){
            atm.setState(new IdleState());
            throw new Error('Max attempts exceeded');
        }
        throw new Error('Incorrect pin');
    }
    withdraw() {
        throw new Error('invalid operation');
    }
    deposit() {
        throw new Error('invalid operation');
    }
    getBalance() {
        throw new Error('invalid operation');
    }
    ejectCard(atm) {
        atm.insertedCard = null;
        atm.setState(new IdleState());
    }
}