import { Library } from "./Library";
import { Book } from "./Book";
import { BookItem, BookItemStatus } from "./BookItem";
import { Member } from "./Member";

console.log("=== Library Management System Test ===\n");

// Helper to create test data
function createTestLibrary() {
    // Create books
    const book1 = new Book("Clean Code", "978-0132350884", "2008", "Robert C. Martin");
    const book2 = new Book("Design Patterns", "978-0201633610", "1994", "Gang of Four");
    const book3 = new Book("The Pragmatic Programmer", "978-0135957059", "2019", "Hunt & Thomas");

    // Create book items (2 copies of Clean Code, 1 copy each for others)
    const bookItem1 = new BookItem("ITEM-001", book1);
    const bookItem2 = new BookItem("ITEM-002", book1);
    const bookItem3 = new BookItem("ITEM-003", book2);
    const bookItem4 = new BookItem("ITEM-004", book3);

    // Create members
    const member1 = new Member("M001", "Alice");
    const member2 = new Member("M002", "Bob");
    const member3 = new Member("M003", "Charlie");

    // Create library
    const library = new Library(
        [book1, book2, book3],
        [member1, member2, member3],
        [bookItem1, bookItem2, bookItem3, bookItem4]
    );

    return { library, book1, book2, book3, bookItem1, bookItem2, bookItem3, bookItem4, member1, member2, member3 };
}

// Test 1: Successful book borrowing
console.log("Test 1: Borrow a book successfully");
const test1 = createTestLibrary();
const record1 = test1.library.borrowBook("M001", test1.book1);
console.log(`  Member: ${record1.member.name}`);
console.log(`  Book: ${record1.bookItem.book.title}`);
console.log(`  Due date: ${record1.dueDate.toLocaleDateString()}`);
console.log(`  BookItem status: ${test1.bookItem1.status}`);
const pass1 = test1.bookItem1.status === BookItemStatus.BORROWED &&
              test1.member1.activeBorrowRecords.length === 1;
console.log(pass1 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 2: Borrow multiple copies of same book
console.log("Test 2: Borrow second copy of same book");
const test2 = createTestLibrary();
test2.library.borrowBook("M001", test2.book1); // First copy
const record2 = test2.library.borrowBook("M002", test2.book1); // Second copy
console.log(`  First copy status: ${test2.bookItem1.status}`);
console.log(`  Second copy status: ${test2.bookItem2.status}`);
const pass2 = test2.bookItem1.status === BookItemStatus.BORROWED &&
              test2.bookItem2.status === BookItemStatus.BORROWED;
console.log(pass2 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 3: Return book on time (no fine)
console.log("Test 3: Return book on time (no fine)");
const test3 = createTestLibrary();
test3.library.borrowBook("M001", test3.book1);
test3.library.returnBook("M001", "ITEM-001");
console.log(`  BookItem status after return: ${test3.bookItem1.status}`);
console.log(`  Member fines: $${test3.member1.totalUnpaidFines}`);
console.log(`  Active borrow records: ${test3.member1.activeBorrowRecords.length}`);
const pass3 = test3.bookItem1.status === BookItemStatus.AVAILABLE &&
              test3.member1.totalUnpaidFines === 0 &&
              test3.member1.activeBorrowRecords.length === 0;
console.log(pass3 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 4: Return book late (with fine)
console.log("Test 4: Return book late (with fine)");
const test4 = createTestLibrary();
const record4 = test4.library.borrowBook("M001", test4.book1);
// Simulate overdue: set dueDate to 3 days ago
record4.dueDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
test4.library.returnBook("M001", "ITEM-001");
console.log(`  Days late: 3`);
console.log(`  Fine amount: $${test4.member1.totalUnpaidFines}`);
const pass4 = test4.member1.totalUnpaidFines === 3;
console.log(pass4 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 5: Cannot borrow with unpaid fines
console.log("Test 5: Cannot borrow with unpaid fines (should throw error)");
const test5 = createTestLibrary();
const record5 = test5.library.borrowBook("M001", test5.book1);
record5.dueDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
test5.library.returnBook("M001", "ITEM-001");
try {
    test5.library.borrowBook("M001", test5.book2);
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log(`  Member has $${test5.member1.totalUnpaidFines} unpaid fines`);
    console.log("✅ PASS\n");
}

// Test 6: Cannot borrow more than 5 books
console.log("Test 6: Cannot borrow more than 5 books (should throw error)");
const test6 = createTestLibrary();
// Add more book items
for (let i = 5; i <= 8; i++) {
    const newBook = new Book(`Book ${i}`, `ISBN-${i}`, "2020", "Author");
    const newItem = new BookItem(`ITEM-${i}`, newBook);
    test6.library.books.push(newBook);
    test6.library.bookItems.push(newItem);
}
// Borrow 5 books
for (let i = 1; i <= 5; i++) {
    test6.library.borrowBook("M001", test6.library.books[i - 1]);
}
console.log(`  Books borrowed: ${test6.member1.activeBorrowRecords.length}`);
try {
    test6.library.borrowBook("M001", test6.library.books[5]); // 6th book
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 7: Reserve book when all copies borrowed
console.log("Test 7: Reserve book when all copies borrowed");
const test7 = createTestLibrary();
test7.library.borrowBook("M001", test7.book1); // Borrow first copy
test7.library.borrowBook("M002", test7.book1); // Borrow second copy
test7.library.reserveBook("M003", test7.book1); // Reserve for Charlie
const queue = test7.library.reservationQueue.get(test7.book1.isbn);
console.log(`  All copies borrowed: ${test7.bookItem1.status}, ${test7.bookItem2.status}`);
console.log(`  Reservation queue length: ${queue?.length}`);
console.log(`  Reserved by: ${queue?.[0].member.name}`);
const pass7 = queue?.length === 1 && queue[0].member.memberId === "M003";
console.log(pass7 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 8: Cannot reserve when book is available
console.log("Test 8: Cannot reserve when book is available (should throw error)");
const test8 = createTestLibrary();
try {
    test8.library.reserveBook("M001", test8.book1); // Book is available
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 9: Search by title (exact match)
console.log("Test 9: Search by title (exact match)");
const test9 = createTestLibrary();
const results9 = test9.library.searchByTitle("Clean Code");
console.log(`  Search term: "Clean Code"`);
console.log(`  Results found: ${results9.length}`);
console.log(`  Book title: ${results9[0]?.title}`);
const pass9 = results9.length === 1 && results9[0].title === "Clean Code";
console.log(pass9 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 10: Search by title (partial match, case-insensitive)
console.log("Test 10: Search by title (partial, case-insensitive)");
const test10 = createTestLibrary();
const results10 = test10.library.searchByTitle("design");
console.log(`  Search term: "design" (lowercase)`);
console.log(`  Results found: ${results10.length}`);
console.log(`  Book title: ${results10[0]?.title}`);
const pass10 = results10.length === 1 && results10[0].title === "Design Patterns";
console.log(pass10 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 11: Search returns empty array for no matches
console.log("Test 11: Search with no matches returns empty array");
const test11 = createTestLibrary();
const results11 = test11.library.searchByTitle("Nonexistent Book");
console.log(`  Search term: "Nonexistent Book"`);
console.log(`  Results found: ${results11.length}`);
const pass11 = results11.length === 0;
console.log(pass11 ? "✅ PASS\n" : "❌ FAIL\n");

// Test 12: Invalid member (should throw error)
console.log("Test 12: Borrow with invalid member (should throw error)");
const test12 = createTestLibrary();
try {
    test12.library.borrowBook("INVALID-ID", test12.book1);
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 13: Book not available (all copies borrowed)
console.log("Test 13: Borrow when no copies available (should throw error)");
const test13 = createTestLibrary();
test13.library.borrowBook("M001", test13.book1); // Borrow first copy
test13.library.borrowBook("M002", test13.book1); // Borrow second copy
try {
    test13.library.borrowBook("M003", test13.book1); // No copies left
    console.log("❌ FAIL - Should have thrown error\n");
} catch (error) {
    console.log(`  Error caught: ${(error as Error).message}`);
    console.log("✅ PASS\n");
}

// Test 14: Complete workflow (borrow, return, borrow again)
console.log("Test 14: Complete workflow - borrow, return, borrow again");
const test14 = createTestLibrary();
test14.library.borrowBook("M001", test14.book1);
console.log(`  Step 1 - Borrowed: ${test14.bookItem1.status}`);
test14.library.returnBook("M001", "ITEM-001");
console.log(`  Step 2 - Returned: ${test14.bookItem1.status}`);
test14.library.borrowBook("M002", test14.book1);
console.log(`  Step 3 - Borrowed again: ${test14.bookItem1.status}`);
const pass14 = test14.bookItem1.status === BookItemStatus.BORROWED &&
               test14.member2.activeBorrowRecords.length === 1;
console.log(pass14 ? "✅ PASS\n" : "❌ FAIL\n");

console.log("=== All Tests Complete ===");
