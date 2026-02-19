# Class Diagram – Smart Expense Sharing System

<img width="1386" height="537" alt="classDiagram" src="https://github.com/user-attachments/assets/b232dcbf-0369-4180-b58b-d64a539e3480" />

---

## Description

This class diagram represents the core domain model and service layer of the Smart Expense Sharing and Budget Management System.

It demonstrates:

- OOP principles (Encapsulation, Inheritance, Polymorphism)
- Strategy Pattern for expense splitting
- Layered architecture (Service layer separation)

---

## Major Classes

### Entities
- User
- AdminUser
- Group
- GroupMember
- Expense
- Split
- Budget

### Services
- AuthService
- ExpenseService
- SettlementService

### Strategy Pattern
- SplitStrategy (Interface)
- EqualSplitStrategy
- PercentageSplitStrategy
- CustomSplitStrategy
