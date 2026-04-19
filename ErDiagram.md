# Entity Relationship (ER) Diagram – Smart Expense Sharing System

<img width="630" height="720" alt="ErDiagram" src="https://github.com/user-attachments/assets/d00fda75-914f-4b4e-98fd-aa829172f4ef" />


---

## Entities and Attributes

### users
- id (Primary Key)
- name
- email
- password
- role
- created_at
- updated_at

### groups
- id (Primary Key)
- name
- created_by (Foreign Key → users.id)
- created_at
- updated_at

### group_members
- id (Primary Key)
- group_id (Foreign Key → groups.id)
- user_id (Foreign Key → users.id)

### expenses
- id (Primary Key)
- group_id (Foreign Key → groups.id)
- paid_by (Foreign Key → users.id)
- amount
- description
- created_at

### splits
- id (Primary Key)
- expense_id (Foreign Key → expenses.id)
- user_id (Foreign Key → users.id)
- amount_owed

### budgets
- id (Primary Key)
- user_id (Foreign Key → users.id)
- monthly_limit
- month

---

## Relationships

- One user can create many groups
- One group can have many members
- One group can have many expenses
- One expense can have many splits
- One user can have many splits
- One user can have multiple monthly budgets
