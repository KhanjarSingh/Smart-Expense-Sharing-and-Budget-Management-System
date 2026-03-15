# Smart Expense Sharing and Budget Management System

## 1. Project Overview

Smart Expense Sharing and Budget Management System is a full-stack web application that allows users to manage shared expenses in groups (friends, roommates, trips, teams) and track personal budgets efficiently.

The system simplifies expense splitting, balance tracking, and settlement between users while following clean backend architecture and OOP principles.

---

## 2. Problem Statement

Managing shared expenses manually often leads to confusion, incorrect calculations, and disputes. There is a need for a structured system that:

- Automatically splits expenses
- Tracks balances between users
- Suggests optimal settlements
- Monitors personal budgets

---

## 3. Scope

This project focuses mainly on backend system design and implementation with:

- Clean layered architecture
- OOP principles
- RESTful APIs
- Proper database design
- Business logic separation
- Design pattern usage

Frontend will consume backend APIs.

---

## 4. Key Features

### User Features

- User Registration & Login (JWT Authentication)
- Create / Join Groups
- Add Expenses
- Split Expenses:
  - Equal split
  - Percentage split
  - Custom split
- View group balances
- View overall balance summary
- Set monthly personal budget
- Track monthly spending
- Settlement suggestions

### Admin Features

- View all users
- Monitor system data

---

## 5. Backend Architecture

The backend follows layered architecture:

- Controllers (API Layer)
- Services (Business Logic Layer)
- Repositories (Data Access Layer)
- Models (Entities)
- DTOs
- Middleware (Authentication, Validation)

---

## 6. OOP Principles Used

- Encapsulation (Private fields with controlled access)
- Abstraction (Service interfaces)
- Inheritance (BaseUser → AdminUser)
- Polymorphism (SplitStrategy interface)

---

## 7. Design Patterns Used

- Repository Pattern
- Strategy Pattern (Expense Split Logic)
- Singleton Pattern (Database Connection)
- Factory Pattern (Split Strategy Creation)

---

## 8. Database

Relational Database (MySQL/PostgreSQL)

---

## 9. Future Enhancements

- Email notifications
- AI-based spending insights
- Mobile app integration
- Payment gateway integration

---

## 10. Conclusion

This system focuses on strong backend design, maintainable architecture, and scalable structure while solving a real-world financial coordination problem.
