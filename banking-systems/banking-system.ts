/**
 * Banking System - Ramp Assessment (4 Levels)
 *
 * LEVEL 1: Basic Operations
 * - createAccount(timestamp, accountId): Create new account
 * - deposit(timestamp, accountId, amount): Deposit money
 * - pay(timestamp, accountId, amount): Withdraw/pay money
 *
 * LEVEL 2: Account Ranking
 * - topActivity(timestamp, n): Get top n accounts by total transaction value
 *
 * LEVEL 3: Scheduled Transfers
 * - scheduleTransfer(timestamp, sourceId, targetId, amount): Schedule a transfer
 * - acceptTransfer(timestamp, accountId, transferId): Accept a pending transfer
 *
 * LEVEL 4: Account Merging
 * - mergeAccounts(timestamp, accountId1, accountId2): Merge account2 into account1
 *
 * KEY LEARNING: Available Balance vs Actual Balance
 * - When a transfer is scheduled, funds are "reserved" from available balance
 * - Available balance = Actual balance - Pending outgoing transfers
 * - All operations must check AVAILABLE balance, not actual balance
 *
 * Critical Bug Fix:
 * ❌ Wrong: if (account.balance < amount) return null;
 * ✅ Correct: if (getAvailableBalance(accountId) < amount) return null;
 */

interface Transaction {
    timestamp: string;
    type: string;
    amount: number;
}

interface Transfer {
    transferId: string;
    sourceId: string;
    targetId: string;
    amount: number;
    scheduledAt: string;
    status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
}

class Account {
    accountId: string;
    balance: number;
    transactions: Transaction[];
    createdAt: string;

    constructor(accountId: string, timestamp: string) {
        this.accountId = accountId;
        this.balance = 0;
        this.transactions = [];
        this.createdAt = timestamp;
    }

    getTotalTransactionValue(): number {
        return this.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    }
}

class BankingSystem {
    private accounts: Map<string, Account>;
    private transfers: Map<string, Transfer>;
    private transferCounter: number;

    constructor() {
        this.accounts = new Map();
        this.transfers = new Map();
        this.transferCounter = 1;
    }

    // ========================================
    // LEVEL 1: Basic Operations
    // ========================================

    createAccount(timestamp: string, accountId: string): boolean {
        if (this.accounts.has(accountId)) {
            return false;  // Account already exists
        }

        const account = new Account(accountId, timestamp);
        this.accounts.set(accountId, account);
        return true;
    }

    deposit(timestamp: string, accountId: string, amount: string): string | null {
        if (!this.accounts.has(accountId)) {
            return null;  // Account not found
        }

        const amountNum = parseInt(amount);
        if (amountNum <= 0) {
            return null;  // Invalid amount
        }

        const account = this.accounts.get(accountId)!;
        account.balance += amountNum;

        account.transactions.push({
            timestamp,
            type: 'DEPOSIT',
            amount: amountNum
        });

        return account.balance.toString();
    }

    pay(timestamp: string, accountId: string, amount: string): string | null {
        if (!this.accounts.has(accountId)) {
            return null;
        }

        const amountNum = parseInt(amount);
        if (amountNum <= 0) {
            return null;
        }

        // ✅ FIX: Check AVAILABLE balance, not actual balance
        const availableBalance = this.getAvailableBalance(accountId);
        if (availableBalance < amountNum) {
            return null;  // Insufficient available funds
        }

        const account = this.accounts.get(accountId)!;
        account.balance -= amountNum;

        account.transactions.push({
            timestamp,
            type: 'PAY',
            amount: amountNum
        });

        return account.balance.toString();
    }

    // ========================================
    // LEVEL 2: Account Ranking
    // ========================================

    topActivity(timestamp: string, n: number): string[] {
        const accountsArray = Array.from(this.accounts.values());

        // Calculate total transaction value for each account
        const accountStats = accountsArray.map(account => ({
            accountId: account.accountId,
            totalValue: account.getTotalTransactionValue()
        }));

        // Sort by total value (descending), then by accountId (ascending)
        accountStats.sort((a, b) => {
            if (b.totalValue !== a.totalValue) {
                return b.totalValue - a.totalValue;
            }
            return a.accountId.localeCompare(b.accountId);
        });

        // Take top n and format output
        const topN = accountStats.slice(0, n);
        return topN.map(stat => `${stat.accountId}(${stat.totalValue})`);
    }

    // ========================================
    // LEVEL 3: Scheduled Transfers
    // ========================================

    scheduleTransfer(timestamp: string, sourceId: string, targetId: string, amount: string): string | null {
        // Validate: source != target
        if (sourceId === targetId) {
            return null;
        }

        // Validate: both accounts exist
        if (!this.accounts.has(sourceId) || !this.accounts.has(targetId)) {
            return null;
        }

        const amountNum = parseInt(amount);

        // ✅ FIX: Check AVAILABLE balance, not actual balance
        const availableBalance = this.getAvailableBalance(sourceId);
        if (availableBalance < amountNum) {
            return null;  // Insufficient available funds
        }

        // Create transfer
        const transferId = `transfer${this.transferCounter++}`;

        const transfer: Transfer = {
            transferId,
            sourceId,
            targetId,
            amount: amountNum,
            scheduledAt: timestamp,
            status: 'PENDING'
        };

        this.transfers.set(transferId, transfer);

        return transferId;
    }

    acceptTransfer(timestamp: string, accountId: string, transferId: string): boolean {
        // Check transfer exists
        if (!this.transfers.has(transferId)) {
            return false;
        }

        const transfer = this.transfers.get(transferId)!;

        // Check not already accepted
        if (transfer.status === 'ACCEPTED') {
            return false;
        }

        // Check not expired (24 hours = 86400000 milliseconds)
        const scheduledAtMs = parseInt(transfer.scheduledAt);
        const currentTimeMs = parseInt(timestamp);
        const EXPIRATION_PERIOD = 24 * 60 * 60 * 1000;

        if (currentTimeMs > scheduledAtMs + EXPIRATION_PERIOD) {
            transfer.status = 'EXPIRED';
            return false;
        }

        // Check accountId is the target account
        if (transfer.targetId !== accountId) {
            return false;
        }

        // Check source still has sufficient funds
        const sourceAccount = this.accounts.get(transfer.sourceId)!;
        if (sourceAccount.balance < transfer.amount) {
            return false;
        }

        // Execute transfer
        const targetAccount = this.accounts.get(transfer.targetId)!;

        sourceAccount.balance -= transfer.amount;
        targetAccount.balance += transfer.amount;

        // Update transaction history for BOTH accounts
        sourceAccount.transactions.push({
            timestamp,
            type: 'TRANSFER_OUT',
            amount: transfer.amount
        });

        targetAccount.transactions.push({
            timestamp,
            type: 'TRANSFER_IN',
            amount: transfer.amount
        });

        // Mark transfer as accepted
        transfer.status = 'ACCEPTED';

        return true;
    }

    // ========================================
    // LEVEL 4: Account Merging
    // ========================================

    mergeAccounts(timestamp: string, accountId1: string, accountId2: string): boolean {
        // Validate both accounts exist
        if (!this.accounts.has(accountId1) || !this.accounts.has(accountId2)) {
            return false;
        }

        // Validate not the same account
        if (accountId1 === accountId2) {
            return false;
        }

        const account1 = this.accounts.get(accountId1)!;
        const account2 = this.accounts.get(accountId2)!;

        // Merge balances
        account1.balance += account2.balance;

        // Merge transaction histories (account2 transactions added to account1)
        account1.transactions.push(...account2.transactions);

        // Remove account2 (it's now merged into account1)
        this.accounts.delete(accountId2);

        return true;
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Calculate total amount in pending outgoing transfers for an account
     * This is the "reserved" or "held" amount
     */
    private getPendingOutgoingAmount(accountId: string): number {
        let totalPending = 0;

        for (const transfer of this.transfers.values()) {
            // Only count PENDING transfers where this account is the SOURCE
            if (transfer.sourceId === accountId && transfer.status === 'PENDING') {
                // Check if not expired
                const scheduledAtMs = parseInt(transfer.scheduledAt);
                const EXPIRATION_PERIOD = 24 * 60 * 60 * 1000;

                // Use current time or could pass timestamp parameter
                const currentTime = Date.now();

                if (currentTime <= scheduledAtMs + EXPIRATION_PERIOD) {
                    totalPending += transfer.amount;
                }
            }
        }

        return totalPending;
    }

    /**
     * Calculate available balance for an account
     * Available balance = Actual balance - Pending outgoing transfers
     *
     * This is the balance that can be used for new operations
     */
    private getAvailableBalance(accountId: string): number {
        const account = this.accounts.get(accountId);
        if (!account) return 0;

        const pendingOutgoing = this.getPendingOutgoingAmount(accountId);
        return account.balance - pendingOutgoing;
    }
}

// ========================================
// EXAMPLE USAGE & TEST CASES
// ========================================

/*
const bank = new BankingSystem();

// Level 1: Basic operations
bank.createAccount("1000", "account1");
bank.createAccount("1001", "account2");
bank.deposit("1002", "account1", "1000");  // "1000"
bank.pay("1003", "account1", "100");       // "900"

// Level 2: Top activity
bank.deposit("1004", "account2", "500");
console.log(bank.topActivity("1005", 2));  // ["account1(1100)", "account2(500)"]

// Level 3: Scheduled transfers
const transferId = bank.scheduleTransfer("2000", "account1", "account2", "300");
console.log(transferId);  // "transfer1"

// Available balance test (KEY CONCEPT)
// account1: balance=900, pending=300, available=600
bank.pay("2001", "account1", "700");  // Should return null (only 600 available)

bank.acceptTransfer("2002", "account2", transferId);  // true
// Now account1: balance=600, account2: balance=800

// Level 4: Merge accounts
bank.mergeAccounts("3000", "account1", "account2");  // true
// account1 now has: balance=1400, combined transaction history
// account2 is deleted
*/
