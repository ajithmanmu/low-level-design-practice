export interface MachineState {
    insertMoney(vendingMachine, amount);
    selectProduct(vendingMachine, product);
    dispense(vendingMachine);
    refund(vendingMachine);
}