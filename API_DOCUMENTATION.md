# 📡 Fine-Grained Permission System: API Specification v1.1

This document provides a comprehensive technical reference for the **Fine-Grained Permission System API**.

## 🏗️ Core Principles

### 1. Standard Response Format

All responses (except for special Django Admin or error pages) are wrapped in a standard JSON envelope:

```json
{
  "success": boolean,
  "message": "Human-readable status",
  "data": { ... } | [ ... ] | null,
  "errors": { "field": ["error message"] } | null
}
```

### 2. Authentication

The API uses **Stateless JWT (JSON Web Tokens)**.

- **Header**: `Authorization: Bearer <your_access_token>`
- **Token Lifespan**: Access tokens are short-lived; use the Refresh token to get a new one without re-authenticating.

---

## 🔐 1. Authentication & Identity

### **Register Account**

`POST /auth/register/`

- **Access**: Public
- **Body**:
  ```json
  {
    "email": "user@fgps.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Success (201)**: Returns user ID and email.

### **Login (Token Exchange)**

`POST /auth/login/`

- **Access**: Public
- **Body**: `{ "email": "...", "password": "..." }`
- **Success (200)**: Returns `access` and `refresh` tokens, plus basic user claims.

### **Token Refresh**

`POST /auth/refresh/`

- **Access**: Public (Body requires Refresh JWT)
- **Body**: `{ "refresh": "<refresh_token>" }`
- **Success (200)**: Returns a fresh `access` token.

### **Fetch My Profile**

`GET /auth/me/`

- **Access**: Authenticated
- **Description**: Returns detailed profile including `permissions` (array of codes) and `employee_details`.

### **Change Password**

`PATCH /auth/change-password/`

- **Access**: Authenticated
- **Body**: `{ "old_password": "...", "new_password": "...", "confirm_password": "..." }`

### **System Genesis**

`POST /auth/genesis/`

- **Access**: Public (Only if system has 0 superusers)
- **Description**: Bootstraps the system with the first Master Admin.
- **Body**: `{ "email": "...", "password": "...", "first_name": "...", "last_name": "..." }`

---

## 🏢 2. Employee Records

### **List & Search Employees**

`GET /employees/`

- **Access**: Granted via `VIEW_EMPLOYEE`
- **Query Params**:
  - `search`: Search across name, email, department, designation.
  - `ordering`: `-created_at`, `first_name`, etc.
  - `page`: Pagination page number.
- **Success (200)**: Paginated list of employees.

### **Create New Employee**

`POST /employees/`

- **Access**: Granted via `CREATE_EMPLOYEE`
- **Body**:
  ```json
  {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@company.com",
    "phone": "+123456789",
    "department": "Engineering",
    "designation": "Lead Developer",
    "date_joined": "2024-01-01"
  }
  ```

### **Update/Patch Employee**

`PATCH /employees/{id}/`

- **Access**: Granted via `EDIT_EMPLOYEE`
- **Body**: Partial update of any employee field.

### **Delete Employee**

`DELETE /employees/{id}/`

- **Access**: Granted via `DELETE_EMPLOYEE`

### **View Personal Record**

`GET /employees/me/`

- **Access**: Granted via `VIEW_SELF`
- **Description**: Automatically retrieves the employee record matching the logged-in user's email.

---

## 🔑 3. Access Control (Admin)

### **List All Users**

`GET /auth/users/`

- **Access**: Granted via `ASSIGN_PERMISSION`
- **Description**: Returns all users in the system to allow admins to select them for permission changes.

### **Assign Function Codes**

`POST /permissions/assign/`

- **Access**: Granted via `ASSIGN_PERMISSION`
- **Body**:
  ```json
  {
    "user_id": 12,
    "permission_codes": ["CREATE_EMPLOYEE", "DELETE_EMPLOYEE"]
  }
  ```
- **Audit**: This action automatically triggers multiple Forensic Audit Logs.

### **Revoke Function Codes**

`POST /permissions/remove/`

- **Access**: Granted via `ASSIGN_PERMISSION`
- **Body**: (Same schema as Assign)

---

## 📜 4. Forensic Auditing

### **View System Audit Trail**

`GET /audit/logs/`

- **Access**: Authenticated (Restricted UI access)
- **Query Params**:
  - `search`: Filters by target email or action.
  - `target_email`: Direct filter for a specific user's history.
- **Data Model**:
  - `action`: PERMISSION_ASSIGNED | PERMISSION_REMOVED
  - `performed_by`: Admin who triggered the change.
  - `target_user`: User whose permissions were changed.
  - `permission_code`: The specific function affected.
  - `timestamp`: Precise clock-time of the event.

---

## 🛠️ Global Status Codes

- `200 OK`: Request succeeded.
- `201 Created`: Resource created.
- `204 No Content`: Resource deleted successfully.
- `400 Bad Request`: Validation failed (check `errors` object).
- `401 Unauthorized`: Token missing or expired.
- `403 Forbidden`: Authenticated, but missing the required Function Code.
- `404 Not Found`: Resource does not exist.
- `500 Server Error`: Unexpected system failure.

---

**Fine-Grained Permission System © 2026**
_Authority Defined by Granular Functions._
