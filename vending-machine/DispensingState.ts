import { IdleState } from "./IdleState";
import { MachineState } from "./MachineState";

export class DispensingState implements MachineState {

    constructor(vendingMachine, selectedProduct) {
        vendingMachine.selectedProduct = selectedProduct;
    }

    insertMoney() {
        throw new Error('Not allowed');
    }
    selectProduct() {
        throw new Error('Not allowed');
    }
    dispense(vendingMachine) {
        vendingMachine.selectedProduct.quantity-=1;
        let changeNeeded = vendingMachine.currentBalance - vendingMachine.selectedProduct.price;
        const changes = vendingMachine.calculateChange(changeNeeded);
        vendingMachine.currentBalance = 0;
        vendingMachine.selectedProduct = null;
        vendingMachine.setState(new IdleState());
        return changes;
    }
    refund() {
        throw new Error('Not allowed');
    }
}