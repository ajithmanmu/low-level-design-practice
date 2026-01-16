import { Member } from "./Member";

export class Librarian extends Member {
    employeeId: string;

    constructor(memberId, name, employeeId) {
        super(memberId, name)
        this.employeeId = employeeId;
    }

    // Librarian specific functions
    
}