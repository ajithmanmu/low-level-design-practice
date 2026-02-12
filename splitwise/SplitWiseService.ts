import { EqualSplit } from "./EqualSplit";
import { ExactSplit } from "./ExactSplit";
import { Expense } from "./Expense";
import { Group } from "./Group";
import { PercentSplit } from "./PercentSplit";
import { Transaction } from "./Transaction";
import { User } from "./User";

export enum SplitType {
    EQUAL = "EQUAL",
    EXACT = "EXACT",
    PERCENT = "PERCENT"
}

export class SplitWiseService {
    users: any;
    groups: any;
    transactions: any;

    constructor() {
        this.users = new Map();
        this.groups = new Map();
        this.transactions = new Map();
    }

    addUser(name) {
        const user = new User(name);
        this.users.set(user.id, user);
    }

    createGroup(name) {
        const group = new Group(name);
        this.groups.set(group.id, group);
    }

    addMemberToGroup(memberId, groupId) {
        if(!this.users.has(memberId)) throw new Error('user not exist');
        if(!this.groups.has(groupId)) throw new Error('group not exist');

        let user = this.users.get(memberId);
        let group = this.groups.get(groupId);
        group.addMember(user);
    }
    
    addExpense(groupId, paidByUserId, amount, description, splitType, splitDetails) {
        if(!this.users.has(paidByUserId)) throw new Error('user not exist');
        if(!this.groups.has(groupId)) throw new Error('group not exist');

        // create splist based on splitType
        /*
            Equal Split: subamount = amount/total members -> create a split(subamount, member)
            Exact Split = needs more input from user: amount per member. Then create a split(amount, member)
            Percent Split = needs more input from user: percentage per member. subamount = amount*percentage/100. Then create a split(amount, member)
        */
       let paidByUser = this.users.get(paidByUserId);
       let group = this.groups.get(groupId);
       let members = group.members;

       let splits = [];
       if(splitType === SplitType.EQUAL) {
        for(let member of members) {
            const split = new EqualSplit(member, amount, members.length);
            splits.push(split);
        }
       } else if(splitType === SplitType.EXACT) {
        for(let member of members) {
            /*
            splitDetails: [{memberId, amount}]
            */
           const splitDetail = splitDetails.find((item)=>item.memberId === member.id)
           const split = new ExactSplit(member, splitDetail.amount);
           splits.push(split);
        }
       } else if(splitType === SplitType.PERCENT) {
            for(let member of members) {
                /*
                splitDetails: [{memberId, percent}]
                */
               const splitDetail = splitDetails.find((item)=>item.memberId === member.id)
               const split = new PercentSplit(member, amount, splitDetail.percent);
               splits.push(split);
            }
       }
       // update balance
       for(let split of splits) {
        if(split.user.id !== paidByUser.id) {
            split.user.updateBalance(paidByUser.id, split.getAmount());
            paidByUser.updateBalance(split.user.id, -split.getAmount());
        }
       }
        // create expense
        const expense = new Expense(amount, group, paidByUser, description, splits);
        group.addExpense(expense);
    }

    getBalances(userId) {
        if(!this.users.has(userId)) throw new Error('user not exist');
        let user = this.users.get(userId);
        return user.balances;
    }

    settleUp(fromUserId, toUserId, amount) {
        if(!this.users.has(fromUserId)) throw new Error('user not exist');       
        if(!this.users.has(toUserId)) throw new Error('user not exist');       

        let fromUser = this.users.get(fromUserId);
        let toUser = this.users.get(toUserId);
        fromUser.updateBalance(toUser.id, -amount);
        toUser.updateBalance(fromUser.id, amount);
        const transaction = new Transaction(fromUser, toUser, amount);
        this.transactions.set(transaction.id, transaction);
    }


}