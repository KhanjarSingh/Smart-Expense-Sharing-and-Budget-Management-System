export class User {
    id: number;
    name: string;
    email: string;
    role: string;

    constructor(id: number, name: string, email: string, role: string = 'user') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    isAdmin(): boolean {
        return this.role === 'admin';
    }
}

export class Group {
    id: number;
    name: string;
    createdBy: number;

    constructor(id: number, name: string, createdBy: number) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
    }
}

export class Expense {
    id: number;
    groupId: number;
    paidBy: number;
    amount: number;
    description: string;

    constructor(id: number, groupId: number, paidBy: number, amount: number, description: string) {
        this.id = id;
        this.groupId = groupId;
        this.paidBy = paidBy;
        this.amount = amount;
        this.description = description;
    }

    getAmountPerPerson(totalPeople: number): number {
        return this.amount / totalPeople;
    }
}

export class Split {
    userId: number;
    amountOwed: number;

    constructor(userId: number, amountOwed: number) {
        this.userId = userId;
        this.amountOwed = amountOwed;
    }
}
