# Sequence Diagram – Add Expense Flow

<img width="1030" height="890" alt="sequenceDiagram" src="https://github.com/user-attachments/assets/5efd9e07-b69e-4d0f-9d3b-eabe3dcb98d8" />


---

## Description

This sequence diagram represents the complete end-to-end flow of adding a shared expense in the Smart Expense Sharing System.

The flow includes authentication, authorization, expense creation, split calculation, database persistence, and balance updates.

---

## Steps

1. User logs into the application.
2. Frontend sends authentication request to backend.
3. Backend validates credentials and generates JWT.
4. User creates a group expense.
5. Backend authenticates and authorizes request.
6. Expense Service calculates split using selected strategy.
7. Expense and split records are saved in database.
8. Balances are updated.
9. Success response is returned to user.

---

## Participants

- User
- React Frontend
- Express Backend
- AuthService
- ExpenseService
- SplitStrategy
- Database
