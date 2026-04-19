import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { GroupController } from '../controllers/GroupController';
import { ExpenseController } from '../controllers/ExpenseController';
import { BudgetController } from '../controllers/BudgetController';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();
const groupController = new GroupController();
const expenseController = new ExpenseController();
const budgetController = new BudgetController();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/groups', authenticate, groupController.createGroup);
router.get('/groups', authenticate, groupController.getGroups);
router.post('/groups/join', authenticate, groupController.joinGroup);
router.get('/groups/:groupId/members', authenticate, groupController.getGroupDetails);

router.post('/expenses', authenticate, expenseController.addExpense);
router.get('/groups/:groupId/balances', authenticate, expenseController.getBalances);
router.get('/groups/:groupId/expenses', authenticate, expenseController.getExpenses);
router.get('/groups/:groupId/settlements', authenticate, expenseController.getSettlements);

router.post('/budget', authenticate, budgetController.setBudget);
router.get('/budget/status', authenticate, budgetController.getBudgetStatus);

export default router;
