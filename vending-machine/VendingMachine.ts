import { IdleState } from "./IdleState";
import { MachineState } from "./MachineState";
import { Product } from "./Product";

export class VendingMachine {
    state: MachineState;
    productInventory: Map<string, Product>; // Map<code:Product>
    cashInventory: Map<string, number>; // Map<deno:count>
    currentBalance: number;
    selectedProduct: Product;

    constructor(productInventory, cashInventory) {
        this.state = new IdleState();
        this.cashInventory = cashInventory;
        this.productInventory = productInventory;
        this.currentBalance = 0;
    }

    showAvailableProducts() {
        const availableProducts = Array.from(this.productInventory).filter(([code, product])=>product.quantity > 0);
        return availableProducts;
    }
    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    insertMoney(amount) {
        this.state.insertMoney(this, amount);
    }

    selectProduct(productName) {
        this.state.selectProduct(this, productName);
    }

    dispense() {
        return this.state.dispense(this);
    }

    refund() {
        return this.state.refund(this);
    }

    calculateChange(changeNeeded) {
        let denominationsArray = Array.from(this.cashInventory);
        denominationsArray.sort((a,b)=>Number(b[0])-Number(a[0]));
        let changes = []
        for(let item of denominationsArray) {
            let denomination = item[0];
            let count = item[1] || 0;
            while(changeNeeded >= Number(denomination) && count > 0) {
                changes.push(denomination);
                changeNeeded = changeNeeded - Number(denomination);
                count-=1;
            }
            this.cashInventory.set(denomination, count);
        }

        if(changeNeeded > 0) {
            // If money still left to dispense then we cannot provide exact change
            throw new Error('Cannot provide exact change')
        }
        return changes;
    }
}