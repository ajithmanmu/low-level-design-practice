/**
 * Financial Ledger - Simple Banking Practice
 *
 * A simple financial ledger system that supports:
 * - Deposits and withdrawals
 * - Transaction history tracking
 * - Refund system (reversing transactions)
 *
 * Key Features:
 * - Transaction tracking with timestamps
 * - Refund logic (refund of deposit = withdrawal, refund of withdrawal = deposit)
 * - Recursive refund support (refunding a refund)
 * - Balance management with validation
 *
 * Good warm-up for the Banking System problem.
 */

interface RefundMetadata {
    type: string;
    refundedTransactionId: number;
}

class Transaction {
    id: number;
    type: string;
    amount: number;
    created: string;
    refundedTransactionId: number | null;

    constructor(id: number, type: string, amount: number, refundedTransactionId: number | null = null) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.created = new Date().toISOString();
        this.refundedTransactionId = refundedTransactionId;
    }
}

class FinancialLedger {
    private balance: number;
    private transactionHistory: Transaction[];
    private transactionIdCounter: number;
    private transactionMap: Map<number, Transaction>;

    constructor() {
        this.balance = 0;
        this.transactionHistory = [];
        this.transactionIdCounter = 0;
        this.transactionMap = new Map();
    }

    deposit(amount: number, refundMetadata?: RefundMetadata): number {
        if (amount <= 0) throw new Error('Amount must be positive');

        const type = refundMetadata?.type || 'DEPOSIT';
        const refundedTransactionId = refundMetadata?.refundedTransactionId || null;

        this.balance += amount;
        const transaction = new Transaction(this.transactionIdCounter++, type, amount, refundedTransactionId);
        this.transactionHistory.push(transaction);
        this.transactionMap.set(transaction.id, transaction);

        return this.balance;
    }

    withdraw(amount: number, refundMetadata?: RefundMetadata): number {
        if (amount <= 0) throw new Error('Amount must be positive');
        if (amount > this.balance) throw new Error('Insufficient funds');

        const type = refundMetadata?.type || 'WITHDRAWAL';
        const refundedTransactionId = refundMetadata?.refundedTransactionId || null;

        this.balance -= amount;
        const transaction = new Transaction(this.transactionIdCounter++, type, amount, refundedTransactionId);
        this.transactionHistory.push(transaction);
        this.transactionMap.set(transaction.id, transaction);

        return this.balance;
    }

    getBalance(): number {
        return this.balance;
    }

    getTransactionHistory(): Transaction[] {
        return [...this.transactionHistory];  // Return copy to prevent mutation
    }

    refund(transactionId: number): void {
        if (!this.transactionMap.has(transactionId)) {
            throw new Error('Transaction not found');
        }

        const transaction = this.transactionMap.get(transactionId)!;

        if (transaction.type === 'DEPOSIT') {
            // Refund deposit = remove money (withdrawal)
            this.withdraw(transaction.amount, {
                type: 'REFUND',
                refundedTransactionId: transaction.id
            });
        } else if (transaction.type === 'WITHDRAWAL') {
            // Refund withdrawal = return money (deposit)
            this.deposit(transaction.amount, {
                type: 'REFUND',
                refundedTransactionId: transaction.id
            });
        } else {
            // REFUND - recursively refund the original transaction
            this.refund(transaction.refundedTransactionId!);
        }
    }
}
