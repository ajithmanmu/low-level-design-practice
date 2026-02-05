export interface State {
    insertCard(atm, card);
    enterPin(atm, pin);
    withdraw(atm, accountId, amount);
    deposit(atm, accountId, amount);
    getBalance(atm, accountId);
    ejectCard(atm);
}