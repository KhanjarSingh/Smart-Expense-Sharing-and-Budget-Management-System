import prisma from '../config/database';
import { User, Group, Expense } from '../models/Entities';

export class UserRepository {
    async createUser(name: string, email: string, passwordHash: string) {
        const user = await prisma.user.create({
            data: { name, email, password: passwordHash }
        });
        return new User(user.id, user.name, user.email, user.role);
    }

    async getUserByEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return user; 
    }

    async getUserById(id: number) {
        return await prisma.user.findUnique({ where: { id } });
    }
}

export class GroupRepository {
    async createGroup(name: string, createdBy: number) {
        const group = await prisma.group.create({
            data: { name, createdBy }
        });
        
        await prisma.groupMember.create({
            data: { groupId: group.id, userId: createdBy }
        });

        return new Group(group.id, group.name, group.createdBy);
    }

    async addMember(groupId: number, userId: number) {
        return await prisma.groupMember.create({
            data: { groupId, userId }
        });
    }

    async getGroupMembers(groupId: number) {
        const members = await prisma.groupMember.findMany({
            where: { groupId },
            include: { user: true }
        });
        return members.map(m => m.user);
    }

    async getUserGroups(userId: number) {
        const memberships = await prisma.groupMember.findMany({
            where: { userId },
            include: { group: true }
        });
        return memberships.map(m => m.group);
    }
}

export class ExpenseRepository {
    async createExpense(groupId: number, paidBy: number, amount: number, description: string, splits: {userId: number, amountOwed: number}[]) {
        const expense = await prisma.expense.create({
            data: {
                groupId,
                paidBy,
                amount,
                description,
                splits: {
                    create: splits.map(s => ({
                        userId: s.userId,
                        amountOwed: s.amountOwed
                    }))
                }
            },
            include: { splits: true }
        });
        return expense;
    }

    async getGroupExpenses(groupId: number) {
        return await prisma.expense.findMany({
            where: { groupId },
            include: { splits: true, payer: true }
        });
    }
}

export class BudgetRepository {
    async setBudget(userId: number, limit: number, month: string) {
        return await prisma.budget.upsert({
            where: { id: (await prisma.budget.findFirst({ where: { userId, month } }))?.id || -1 },
            update: { monthlyLimit: limit },
            create: { userId, monthlyLimit: limit, month }
        });
    }

    async getBudget(userId: number, month: string) {
        return await prisma.budget.findFirst({ where: { userId, month } });
    }
}
