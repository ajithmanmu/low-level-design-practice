export class Book {
    title: string;
    isbn: string;
    published: string;
    author: string;

    constructor(title: string, isbn: string, published: string, author: string) {
        this.title = title;
        this.isbn = isbn;
        this.published = published;
        this.author = author;
    }
}