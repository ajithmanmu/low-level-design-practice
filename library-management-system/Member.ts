const MAX_ALLOWED_BOOKS = 5;

export class Member {
    memberId: string;
    name: string;
    activeBorrowRecords: any[];
    totalUnpaidFines: number;

    constructor(memberId: string, name: string) {
        this.memberId = memberId;
        this.name = name;
        this.activeBorrowRecords = [];
        this.totalUnpaidFines = 0;
    }

    canBorrow() {
        if(this.totalUnpaidFines > 0) return false;
        return this.activeBorrowRecords.length < MAX_ALLOWED_BOOKS
    }

}