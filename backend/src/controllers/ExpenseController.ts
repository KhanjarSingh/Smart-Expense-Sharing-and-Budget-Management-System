import { Request, Response } from 'express';
import { ExpenseService } from '../services/ExpenseService';

const expenseService = new ExpenseService();

export class ExpenseController {
    async addExpense(req: Request, res: Response) {
        try {
            const { groupId, amount, description, splitType, splitData } = req.body;
            const paidBy = (req as any).user.id;
            const expense = await expenseService.addExpense(groupId, paidBy, amount, description, splitType, splitData);
            res.status(201).json(expense);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBalances(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            const balances = await expenseService.getBalances(parseInt(groupId as string));
            res.status(200).json(balances);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getExpenses(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            const expenses = await expenseService.getGroupExpenses(parseInt(groupId as string));
            res.status(200).json(expenses);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSettlements(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            const settlements = await expenseService.calculateSettlements(parseInt(groupId as string));
            res.status(200).json(settlements);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
