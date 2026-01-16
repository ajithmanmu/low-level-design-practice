import { Book } from "./Book";
import { Member } from "./Member";

export class Reservation {
    book: Book;
    member: Member;
    reservationDate: Date;
    
    constructor(book: Book, member: Member) {
        this.book = book; // We reserve a Book , not a BookItem
        this.member = member;
        this.reservationDate = new Date();
    }
}