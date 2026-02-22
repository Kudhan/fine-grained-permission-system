# Fine-Grained Permission System: Backend Architecture & Implementation Guide

This document provides a comprehensive deep-dive into the backend architecture of the **Fine-Grained Permission System**. It explains the core logic, data flow, security models, and how different modules interact to provide a robust, enterprise-grade access control layer.

---

## 1. System Philosophy & Core Objective

The primary goal of this backend is to move away from binary "User/Admin" roles and instead provide **Atomic Access Control**.

- **Granular Functions**: Every sensitive action (e.g., `CREATE_EMPLOYEE`, `ASSIGN_PERMISSION`) is represented as a unique code.
- **Direct Mapping**: Users are mapped directly to these specific codes, allowing for precise control over what each individual can perform.
- **Bypass Mechanism**: Superusers (`is_superuser=True`) automatically bypass all granular checks for emergency administrative access.

---

## 2. Technical Stack

- **Framework**: Django 5.0.1
- **API Engine**: Django Rest Framework (DRF)
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Static Hosting**: WhiteNoise (Serving frontend assets)
- **WSGI Server**: Gunicorn

---

## 3. High-Level Modular Structure

The backend is split into 5 core internal applications located in `/backend/apps/`:

### 🛡️ 1. `accounts` (Identity Management)

Responsible for the "Who" in the system.

- **Custom User Model**: Extends `AbstractUser` to use `email` as the primary identifier instead of `username`.
- **Function Mapping**: Includes a `ManyToManyField` to the `Function` model, which holds the user's granted permissions.
- **DiceBear Integration**: Stores an `avatar_seed` for consistent biometric-style avatars transition to frontend.

### 🔑 2. `permissions` (The Engine)

The brain of the system that defines "What" can be done.

- **`Function` Model**: Stores permission codes (e.g., `VIEW_AUDIT_LOG`).
- **`HasPermission` Class**: A custom DRF permission class that decorators views. It checks the user's `functions` list against required codes.
- **Action Views**: Specialized endpoints for `AssignPermissionView` and `RemovePermissionView`.

### 👥 3. `employees` (Core Domain)

The primary business entity used to demonstrate the system.

- **Permissions Enforced**:
  - `VIEW_EMPLOYEE`: Required for GET requests.
  - `CREATE_EMPLOYEE`: Required for POST requests.
  - `EDIT_EMPLOYEE`: Required for PATCH requests.
  - `DELETE_EMPLOYEE`: Required for DELETE requests.

### 📜 4. `audit` (Security Tracing)

The immutable record of "How" the system changed.

- **`AuditLog` Model**: Records whenever a dynamic permission is granted or revoked.
- **Fields**: `performed_by`, `target_user`, `action`, `permission_code`, and `timestamp`.

### ⚙️ 5. `core` (Infrastructure)

Shared utilities and standardized response handlers to ensure the "Junior Developer" style consistency across all apps.

---

## 4. The Request Life Cycle (Step-by-Step Flow)

1.  **Incoming Request**: A request hits the server (e.g., `POST /employees/`).
2.  **Authentication Middleware**: SimpleJWT extracts the `Bearer` token from the header.
    - Validates token signature.
    - Populates `request.user` with the User instance.
3.  **URL Routing**: The `config/urls.py` routes the request to the specific View (e.g., `EmployeeCreateView`).
4.  **Permission Enforcement**:
    - The `HasPermission('CREATE_EMPLOYEE')` class is triggered.
    - It checks if `request.user.is_superuser`. If yes, access granted.
    - If not, it queries the join table: `User.functions.filter(code='CREATE_EMPLOYEE').exists()`.
5.  **View Execution**: If granted, the view processes the data using a Serializer.
6.  **Audit Generation**: For sensitive actions (like permission changes), the view creates an `AuditLog` entry before returning.
7.  **Standardized Response**: The `api_response` utility wraps the result in a clean JSON structure:
    ```json
    {
      "success": true,
      "message": "Action completed",
      "data": { ... }
    }
    ```

---

## 5. Security Protocols & Implementation Details

### JWT Workflow

- **Login**: Returns `access` and `refresh` tokens.
- **Refresh**: A dedicated endpoint `/auth/refresh/` allows the frontend to stay logged in without re-entering credentials for 24 hours.

### Fine-Grained Check Logic (`permissions.py`)

```python
def has_permission(self, request, view):
    if request.user.is_superuser: return True
    return request.user.functions.filter(code=self.required_code.upper()).exists()
```

### Auditing Flow

When an Admin (with `ASSIGN_PERMISSION`) gives a user the `VIEW_EMPLOYEE` code:

1.  The `AssignPermissionView` adds the function to the user.
2.  A loop iterates through codes and saves `AuditLog(action='PERMISSION_ASSIGNED', ...)` records.
3.  The frontend "Audit Logs" page instantly reflects this change.

---

## 6. Environment & Deployment Configuration

The system is built to be **Cloud-Ready**:

- **`dj-database-url`**: Automatically detects database strings from environment variables (Heroku, Render, AWS).
- **`WhiteNoise`**: Configured to serve the compiled React frontend from the `staticfiles/` directory in production.
- **`python-dotenv`**: Manages secrets locally.
- **Security Middleware**: Configured to require SSL (`sslmode=require`) in production environments.

---

## 7. Developer Conventions

- **Naming**: All models use PascalCase, all fields use snake_case.
- **Permissions**: Always defined in uppercase (e.g., `SYSTEM_ADMIN`).
- **Response**: NEVER return raw Django error strings; always intercept and wrap in the `api_response` format for frontend safety.
