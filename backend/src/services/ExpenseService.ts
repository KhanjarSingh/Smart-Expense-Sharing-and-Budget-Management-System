import { ExpenseRepository, GroupRepository } from '../repositories/Repositories';
import { SplitStrategy, EqualSplitStrategy, PercentageSplitStrategy, CustomSplitStrategy } from './SplitStrategy';

const expenseRepo = new ExpenseRepository();
const groupRepo = new GroupRepository();

export class ExpenseService {
    async addExpense(groupId: number, paidBy: number, amount: number, description: string, splitType: string, splitData: any) {
        const members = await groupRepo.getGroupMembers(groupId);
        const userIds = members.map(m => m.id);
        
        let strategy: SplitStrategy;
        
        if (splitType === 'equal') {
            strategy = new EqualSplitStrategy();
        } else if (splitType === 'percentage') {
            strategy = new PercentageSplitStrategy();
        } else {
            strategy = new CustomSplitStrategy();
        }
        
        const splits = strategy.calculateSplit(amount, userIds, splitData);
        
        return await expenseRepo.createExpense(groupId, paidBy, amount, description, splits);
    }

    async getBalances(groupId: number) {
        const expenses = await expenseRepo.getGroupExpenses(groupId);
        let balances: any = {};
        
        expenses.forEach(exp => {
            if (!balances[exp.paidBy]) balances[exp.paidBy] = 0;
            balances[exp.paidBy] += exp.amount;
            
            exp.splits.forEach(split => {
                if (!balances[split.userId]) balances[split.userId] = 0;
                balances[split.userId] -= split.amountOwed;
            });
        });
        
        return balances;
    }

    async getGroupExpenses(groupId: number) {
        return await expenseRepo.getGroupExpenses(groupId);
    }

    async calculateSettlements(groupId: number) {
        const balances = await this.getBalances(groupId);
        const debtors: { id: number, amount: number }[] = [];
        const creditors: { id: number, amount: number }[] = [];

        for (const userId in balances) {
            const amount = balances[userId];
            if (amount < -0.01) debtors.push({ id: parseInt(userId), amount: Math.abs(amount) });
            else if (amount > 0.01) creditors.push({ id: parseInt(userId), amount });
        }

        const settlements: { from: number, to: number, amount: number }[] = [];
        let i = 0, j = 0;

        while (i < debtors.length && j < creditors.length) {
            const d = debtors[i];
            const c = creditors[j];
            const settleAmount = Math.min(d.amount, c.amount);

            settlements.push({ from: d.id, to: c.id, amount: settleAmount });

            d.amount -= settleAmount;
            c.amount -= settleAmount;

            if (d.amount < 0.01) i++;
            if (c.amount < 0.01) j++;
        }

        return settlements;
    }
}
