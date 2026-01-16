import { Book } from "./Book";
import { BookItem, BookItemStatus } from "./BookItem";
import { BorrowRecord } from "./BorrowRecord";
import { Member } from "./Member";
import { Reservation } from "./Reservation";

export class Library {
    books: Book[];
    members: Member[];
    bookItems: BookItem[];
    activeBorrowRecords: BorrowRecord[];
    reservationQueue: Map<string, Reservation[]>;
    
    constructor(books: Book[], members: Member[], bookItems: BookItem[]) {
        this.books = books;
        this.members = members;
        this.bookItems = bookItems;
        this.activeBorrowRecords = [];
        this.reservationQueue = new Map();
    }

    borrowBook(memberId: string, book: Book) {
        // check member eligible
        const member = this.members.find((member)=>member.memberId === memberId);
        if(!member) throw new Error('Invalid member');
        if(!member.canBorrow()) throw new Error('Unable to borrow at this time');
        // Get all BookItems for this book and return teh first available
        const availableBookItem = this.bookItems.find((bookItem)=>bookItem.book.isbn === book.isbn && bookItem.status === BookItemStatus.AVAILABLE);
        if(!availableBookItem) throw new Error('book not available');
        
        // create a borrowrecord. Add it to activeBorrowRecords here and to member level
        const borrowRecord = new BorrowRecord(member, availableBookItem);
        availableBookItem.status = BookItemStatus.BORROWED;
        this.activeBorrowRecords.push(borrowRecord);
        member.activeBorrowRecords.push(borrowRecord);
        return borrowRecord;
    }

    returnBook(memberId: string, bookItemId: string) {
        // check member eligible
        const member = this.members.find((member)=>member.memberId === memberId);
        if(!member) throw new Error('Invalid member');

        // check bookitem is eligible
        const bookItem = this.bookItems.find((item)=>item?.itemId === bookItemId);
        if(!bookItem) throw new Error('Invalid book item');

        const borrowRecord = this.activeBorrowRecords.find((record)=>record.bookItem === bookItem);
        if(!borrowRecord) throw new Error('no borrow record available');
        
        borrowRecord.actualReturnDate = new Date();
        if(borrowRecord.isOverDue()) {
            member.totalUnpaidFines+=borrowRecord.calculateFine();
        }
        // remove from active borrow records
        this.activeBorrowRecords = this.activeBorrowRecords.filter((record)=>record.bookItem !== bookItem)
        // remove from member
        member.activeBorrowRecords = member.activeBorrowRecords.filter((record)=>record.bookItem !== bookItem)

        bookItem.status = BookItemStatus.AVAILABLE;
    }

    reserveBook(memberId: string, book: Book) {
        // check member eligible
        const member = this.members.find((member)=>member.memberId === memberId);
        if(!member) throw new Error('Invalid member');
        if(!member.canBorrow()) throw new Error('Unable to reserve at this time');

        // User can borrow it if available
        // Get all BookItems for this book and return teh first available
        const availableBookItem = this.bookItems.find((bookItem)=>bookItem.book.isbn === book.isbn && bookItem.status === BookItemStatus.AVAILABLE);
        if(availableBookItem) throw new Error('book is available, borrow it instead');


        const reservation = new Reservation(book, member);
        if(!this.reservationQueue.has(book.isbn)) {
            this.reservationQueue.set(book.isbn, [])
        }
        this.reservationQueue.get(book.isbn)?.push(reservation);
    }

    searchByTitle(title: string) {
        return this.books.filter((item)=>item.title.toLowerCase().includes(title.toLowerCase()));
    }

}