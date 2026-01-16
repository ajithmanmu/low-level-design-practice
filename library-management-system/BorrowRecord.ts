import { BookItem } from "./BookItem";
import { Member } from "./Member";

const LOAN_PERIOD = 14;
const FINE_PER_DAY = 1;

export class BorrowRecord {
    member: Member;
    borrowedDate: Date;
    dueDate: Date;
    actualReturnDate: Date | null;
    bookItem: BookItem;

    constructor(member: Member, bookItem: BookItem) {
        this.member = member;
        this.borrowedDate = new Date();
        this.dueDate = new Date(Date.now() + LOAN_PERIOD * 24 * 60 * 60 * 1000);
        this.bookItem = bookItem;
        this.actualReturnDate = null;
    }
    
    // can add isOverDue or calculateFine functions

    isOverDue() {

        /*
// TODO: NOTE:
  Works for your current usage, but consider this scenario:
  - Book due date: Jan 10
  - You return it on Jan 8 (early!)
  - Someone checks isOverDue() on Jan 12
  - Returns TRUE (because current date > due date)
  - But book was returned on time!

  More robust approach:
  isOverDue(): boolean {
      // If book returned, check against actual return date
      if (this.actualReturnDate) {
          return this.actualReturnDate > this.dueDate;
      }
      // If not returned yet, check against current date
      return new Date() > this.dueDate;
  }
        */
        const currentDate = new Date();
        if(currentDate > this.dueDate) return true;
        return false;
    }

    calculateFine() {
        if(!this.isOverDue()) return 0;
        if (!this.actualReturnDate) {
            throw new Error("Cannot calculate fine - book not returned yet");
        }
        const daysLate = Math.ceil(
            (this.actualReturnDate.getTime() - this.dueDate.getTime())
            / (1000 * 60 * 60 * 24)
        );
        return daysLate * FINE_PER_DAY;
    }

}