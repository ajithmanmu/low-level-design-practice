import { DispensingState } from "./DispensingState";
import { IdleState } from "./IdleState";
import { MachineState } from "./MachineState";

export class HasMoneyState implements MachineState {
    
    constructor() {
        // vendingMachine.currentBalance = amount;
    }
    insertMoney(vendingMachine, amount) {
        vendingMachine.currentBalance+=amount;
        // Add amount to cash inventory as well (convert to string to match key type)
        const denomKey = amount.toString();
        if(!vendingMachine.cashInventory.has(denomKey)) {
            vendingMachine.cashInventory.set(denomKey, 0);
        }
        vendingMachine.cashInventory.set(denomKey, vendingMachine.cashInventory.get(denomKey) + 1);
    }
    selectProduct(vendingMachine, productCode) {
        // check if product is available
        const product = vendingMachine.productInventory.get(productCode)
        if(!product || product.quantity <= 0) throw new Error('Product not available');
        // check if cash is enough
        if(product.price > vendingMachine.currentBalance) throw new Error('Not enough money');
        
        vendingMachine.setState(new DispensingState(vendingMachine, product))
        
    }
    dispense() {
        throw new Error('Please select product');
    }
    refund(vendingMachine) {
        const moneyToRefund = vendingMachine.currentBalance;
        const refunds = vendingMachine.calculateChange(moneyToRefund)
        vendingMachine.currentBalance = 0;
        vendingMachine.selectedProduct = null;
        vendingMachine.setState(new IdleState());
        return refunds;
    }
}