import { Request, Response } from 'express';
import { BudgetRepository } from '../repositories/Repositories';
import prisma from '../config/database';

const budgetRepo = new BudgetRepository();

export class BudgetController {
    async setBudget(req: Request, res: Response) {
        try {
            const { limit, month } = req.body;
            const userId = (req as any).user.id;
            const budget = await budgetRepo.setBudget(userId, parseFloat(limit), month);
            res.status(200).json(budget);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBudgetStatus(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { month } = req.query;
            
            const budget = await budgetRepo.getBudget(userId, month as string);
            
            // Calculate total spent by user in this month
            const expenses = await prisma.expense.findMany({
                where: {
                    paidBy: userId,
                    createdAt: {
                        gte: new Date(`${month}-01`),
                        lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1))
                    }
                }
            });
            
            const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
            
            res.status(200).json({
                budget: budget ? budget.monthlyLimit : 0,
                totalSpent
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
