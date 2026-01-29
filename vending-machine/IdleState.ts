import { HasMoneyState } from "./HasMoneyState";
import { MachineState } from "./MachineState";

export class IdleState implements MachineState {

    constructor() {
        
    }
    insertMoney(vendingMachine, amount) {
        vendingMachine.setState(new HasMoneyState());
        vendingMachine.getState().insertMoney(vendingMachine, amount);
    }
    selectProduct() {
        throw new Error('Please insert money first');
    }
    dispense() {
        throw new Error('Please insert money first');
    }
    refund() {
        throw new Error('No money to refund');
    }
}