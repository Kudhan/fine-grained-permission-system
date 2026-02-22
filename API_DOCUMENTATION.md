# 📡 Fine-Grained PS: API Documentation v1.0

This document defines the complete REST API interface for the **Fine-Grained Permission System**. Every endpoint follows the standardized `api_response` format and enforces granular function-based authorization.

---

## 🔐 1. Authentication & Identity

### **Register New Identity**

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
- **Response**: `201 Created`

### **Login (Obtain JWT)**

`POST /auth/login/`

- **Access**: Public
- **Body**:
  ```json
  { "email": "admin@fgps.com", "password": "adminfgps" }
  ```
- **Response**: `200 OK` (Returns `access` and `refresh` tokens)

### **Refresh Token**

`POST /auth/refresh/`

- **Access**: Public (requires valid refresh token)
- **Body**: `{ "refresh": "<refresh_token>" }`
- **Response**: `200 OK` (Returns new `access` token)

### **Get Current Profile & Permissions**

`GET /auth/me/`

- **Access**: Authenticated
- **Response**: Returns the user's personal details and their array of granted `functions` (permission codes).

### **Establish Root Identity (Genesis)**

`POST /auth/genesis/`

- **Access**: Internal Protocol
- **Description**: Creates the first system administrator with full `ASSIGN_PERMISSION` rights.

---

## 🏢 2. Employee Management (Domain)

### **List Employees**

`GET /employees/`

- **Permission**: `VIEW_EMPLOYEE`
- **Query Params**: `?page=1&search=query`
- **Response**: Paginated list of all organization personnel.

### **Create Employee**

`POST /employees/`

- **Permission**: `CREATE_EMPLOYEE`
- **Body**: `first_name`, `last_name`, `email`, `phone`, `department`, `designation`.

### **Update Employee**

`PATCH /employees/{id}/`

- **Permission**: `EDIT_EMPLOYEE`
- **Body**: Any partial fields to update.

### **Remove Employee**

`DELETE /employees/{id}/`

- **Permission**: `DELETE_EMPLOYEE`

### **View Personal Employee Record**

`GET /employees/me/`

- **Permission**: `VIEW_SELF`
- **Description**: Returns only the employee record linked to the authenticated user.

---

## 🔑 3. Access Control (Permissions)

### **List User Directory**

`GET /auth/users/`

- **Permission**: `ASSIGN_PERMISSION`
- **Description**: Returns all user identities for permission auditing and assignment.

### **Assign Function Codes**

`POST /permissions/assign/`

- **Permission**: `ASSIGN_PERMISSION`
- **Body**:
  ```json
  {
    "user_id": 5,
    "permission_codes": ["CREATE_EMPLOYEE", "VIEW_AUDIT_LOG"]
  }
  ```

### **Revoke Function Codes**

`POST /permissions/remove/`

- **Permission**: `ASSIGN_PERMISSION`
- **Body**: Same as Assign.

---

## 📜 4. Security Audit (Tracing)

### **Fetch Audit Logs**

`GET /audit/logs/`

- **Permission**: `IsAuthenticated` (Recommended: `ASSIGN_PERMISSION`)
- **Query Params**: `?target_email=user@fgps.com`
- **Description**: A chronological feed of all permission changes and security events within the system.

---

## 🏗️ Response Standard

All endpoints return a wrapper object:

```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... },
  "errors": null
}
```

---

**API Base URL**: `http://localhost:8000/` or your production domain.
