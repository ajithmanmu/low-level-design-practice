import { CardInsertedState } from "./CardInsertedState";
import { State } from "./State";

export class IdleState implements State {
    constructor(){

    }
    insertCard(atm, cardNumber) {
        atm.setState(new CardInsertedState());
        atm.insertedCard = cardNumber;
    }
    enterPin() {
        throw new Error('invalid operation');
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
    ejectCard() {
        throw new Error('invalid operation');
    }
}