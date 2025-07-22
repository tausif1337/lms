# Assignment: Category & Course CRUD Application

**Deadline:** 2025-07-27 11:59 PM

## Objective
Build a simple Learning Management System (LMS) feature that allows users to **Create, Read, Update, and Delete (CRUD)** both **Categories** and **Courses**. This assignment will help you practice full-stack development using Django (backend) and React (frontend).

---

## Requirements

### 1. Backend (Django)
- **Models:**
  - Create a `Category` model (e.g., name, description).
  - Create a `Course` model (e.g., title, description, category [ForeignKey], etc.).
- **APIs:**
  - Implement RESTful API endpoints for both Category and Course:
    - List all
    - Retrieve single
    - Create
    - Update
    - Delete
- **Serializers:**
  - Use Django REST Framework serializers for data validation and transformation.
- **Admin Panel:**
  - Register both models for easy management.

### 2. Frontend (React)
- **Pages/Components:**
  - Category List, Create, Edit, Delete
  - Course List, Create, Edit, Delete
- **API Integration:**
  - Connect frontend to backend APIs for all CRUD operations.
- **UI/UX:**
  - Use forms for create/update.
  - Display lists in tables or cards.
  - Show success/error messages.

---

## Bonus (Optional)
- Add search/filter for courses by category.
- Add authentication (login/logout) for admin actions.

---

## Submission
- Push your code to your repository.
- Ensure both backend and frontend are working.
- Include screenshots or a short video demo if possible.

---

## Tips
- Test each API endpoint with tools like Postman before connecting the frontend.
- Use React hooks (e.g., `useState`, `useEffect`) for state management.
- Keep your code clean and well-commented.

---

Good luck! If you have questions, ask your instructor. 