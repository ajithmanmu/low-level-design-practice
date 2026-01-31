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

        // Design Decision: One product per transaction (traditional vending machine)
        // We reset balance to 0 and return ALL change after each purchase.
        // For multi-product transactions, instead:
        //   - Set: vendingMachine.currentBalance -= vendingMachine.selectedProduct.price
        //   - Stay in HasMoneyState if balance > 0 (instead of IdleState on line 25)
        //   - Only return change when user requests refund or balance is 0
        vendingMachine.currentBalance = 0;
        vendingMachine.selectedProduct = null;
        vendingMachine.setState(new IdleState());
        return changes;
    }
    refund() {
        throw new Error('Not allowed');
    }
}