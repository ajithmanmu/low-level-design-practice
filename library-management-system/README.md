# Library Management System - LLD

Low-level design implementation of a library management system that handles book catalog, member management, borrowing/returning workflows, fines, and reservations.

## How to Run

```bash
ts-node test.ts
```

## Classes

### 1. Book
- Represents book metadata (title, ISBN, author, published)
- One Book can have multiple physical copies (BookItems)

### 2. BookItem
- Represents a physical copy of a book
- Properties: `itemId`, `status` (AVAILABLE/BORROWED/RESERVED/LOST), `book` reference
- Key distinction: Book vs BookItem separation

### 3. Member
- Represents library users
- Properties: `memberId`, `name`, `activeBorrowRecords`, `totalUnpaidFines`
- Validation: canBorrow() checks max 5 books limit and unpaid fines

### 4. Librarian (extends Member)
- Inherits from Member for type checking
- Used for permission validation in Library operations

### 5. Admin (extends Librarian)
- Highest level permissions
- Inherits all Librarian capabilities

### 6. BorrowRecord
- Tracks book borrowing transactions
- Properties: `member`, `bookItem`, `borrowedDate`, `dueDate`, `actualReturnDate`
- Methods: `isOverDue()`, `calculateFine()`
- 14-day loan period, $1 per day late fee

### 7. Reservation
- Tracks book reservations when all copies are borrowed
- Properties: `book`, `member`, `reservationDate`
- Note: References Book (not BookItem) - any available copy fulfills reservation

### 8. Library
- Main orchestrator managing all operations
- Core methods:
  - `borrowBook()` - Validates member, finds available copy, creates record
  - `returnBook()` - Handles returns, calculates fines, updates state
  - `reserveBook()` - Manages FIFO reservation queue
  - `searchByTitle()` - Partial, case-insensitive search

## Key Features

- **Book vs BookItem separation** - Track individual physical copies
- **Fine calculation** - Automatic calculation based on days overdue
- **Borrowing limits** - Max 5 books per member
- **Fine blocking** - Members with unpaid fines cannot borrow
- **Reservation system** - FIFO queue when all copies borrowed
- **Smart validation** - Cannot reserve available books
- **Search functionality** - Partial, case-insensitive title search

## Business Rules

1. **Borrowing:**
   - Member can borrow up to 5 books
   - Member must have no unpaid fines
   - Book must have available copies

2. **Returning:**
   - Late returns incur $1/day fine
   - BookItem status reset to AVAILABLE
   - Member's fine balance updated

3. **Reservations:**
   - Only allowed when all copies are borrowed
   - FIFO queue per book (by ISBN)
   - Member must be eligible to borrow

4. **Search:**
   - Case-insensitive partial matching
   - Returns all matching books

## Test Cases

1. Borrow book successfully
2. Borrow second copy of same book
3. Return book on time (no fine)
4. Return book late (with fine calculation)
5. Cannot borrow with unpaid fines
6. Cannot borrow more than 5 books
7. Reserve book when all copies borrowed
8. Cannot reserve when book is available
9. Search by title (exact match)
10. Search by title (partial, case-insensitive)
11. Search with no matches returns empty array
12. Invalid member error handling
13. No available copies error handling
14. Complete workflow (borrow → return → borrow again)

## Design Patterns

- **Orchestrator Pattern**: Library class manages all business logic
- **Data Encapsulation**: BorrowRecord handles fine calculation
- **Inheritance**: Member → Librarian → Admin hierarchy
- **FIFO Queue**: Reservation queue using Map<ISBN, Reservation[]>
- **Single Responsibility**: Each class has focused purpose

## Key Design Decisions

**Why Book vs BookItem separation?**
- Book = metadata (ISBN, title, author)
- BookItem = physical copy (barcode, status)
- Enables tracking individual copies independently

**Why store activeBorrowRecords in Member?**
- Easy access to member's current borrows
- O(1) count check for 5-book limit
- Trade-off: Duplicate data vs simpler validation

**Why FIFO queue for reservations?**
- Fair allocation (first come, first served)
- Simple Map<ISBN, Reservation[]> structure
- Push to end, shift from front

**Why simple fine tracking (totalUnpaidFines)?**
- Keeps Member class simple
- Interview time constraints
- Can extend to Fine class if needed

## Data Structures

```typescript
Library {
  books: Book[]                              // All book metadata
  bookItems: BookItem[]                      // All physical copies
  members: Member[]                          // All members
  activeBorrowRecords: BorrowRecord[]        // Current loans
  reservationQueue: Map<string, Reservation[]>  // ISBN -> queue
}
```

## Extensions (Not Implemented)

- Book renewal system
- Notification system (Observer pattern)
- Payment processing for fines
- Search by author/ISBN
- Multiple library locations
- Book categories (reference, magazines)
