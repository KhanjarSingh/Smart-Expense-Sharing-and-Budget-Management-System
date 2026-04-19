export interface SplitStrategy {
    calculateSplit(amount: number, users: number[], customAmounts?: number[]): { userId: number, amountOwed: number }[];
}

export class EqualSplitStrategy implements SplitStrategy {
    calculateSplit(amount: number, users: number[]): { userId: number, amountOwed: number }[] {
        const splitAmount = amount / users.length;
        return users.map(user => ({
            userId: user,
            amountOwed: splitAmount
        }));
    }
}

export class PercentageSplitStrategy implements SplitStrategy {
    calculateSplit(amount: number, users: number[], percentages: number[]): { userId: number, amountOwed: number }[] {
        return users.map((user, index) => ({
            userId: user,
            amountOwed: (amount * percentages[index]) / 100
        }));
    }
}

export class CustomSplitStrategy implements SplitStrategy {
    calculateSplit(amount: number, users: number[], customAmounts: number[]): { userId: number, amountOwed: number }[] {
        return users.map((user, index) => ({
            userId: user,
            amountOwed: customAmounts[index]
        }));
    }
}
