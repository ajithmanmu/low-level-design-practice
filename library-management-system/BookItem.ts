import { Book } from "./Book";

export enum BookItemStatus {
    AVAILABLE = "AVAILABLE",
    BORROWED = "BORROWED",
    RESERVED = "RESERVED", // when someone reserves it in advance
    LOST = "LOST"
}

export class BookItem {
    itemId: string;
    status: BookItemStatus;
    book: Book;

    constructor(itemId: string, book: Book) {
        this.itemId = itemId;
        this.status = BookItemStatus.AVAILABLE;
        this.book = book;
    }
}