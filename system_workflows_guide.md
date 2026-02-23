# Fine-Grained PS: Key System Workflows & Logic Flows

This document explains the specific behavioral flows of the system, showing how a user moves through the application and how the backend reacts at each stage.

---

## Workflow 1: The "New User" Journey

1.  **Identity Creation**: User registers via `/auth/register/`.
    - _Backend Logic_: Creates a `User` record. By default, this user has **zero** custom permissions (`functions`).
2.  **Initial State**: User logs in.
    - _Backend Logic_: JWT returns user data. The `permissions` array in the response is empty `[]`.
    - _UI Result_: Dashboard shows 0 permissions. "Employee List" and "Audit Logs" are hidden or restricted.

---

## Workflow 2: Administrative Provisioning (The "Genesis" Flow)

1.  **Elevation**: A Superuser (established via `python manage.py createsuperuser` or the `GenesisView`) logs in.
2.  **Directory Access**: Admin navigates to "Access Control".
3.  **Permission Granting**: Admin selects the new user and clicks "Assign" on `ASSIGN_PERMISSION`.
    - _Backend Logic_: `AssignPermissionView` adds the code to the user.
    - _Audit Logic_: An `AuditLog` is created: `[Admin] assigned [ASSIGN_PERMISSION] to [NewUser]`.
4.  **Propagation**: The new user now has the power to manage _other_ users' permissions.

---

## Workflow 3: Data Access & Enforcement (The "Employee" Flow)

1.  **Request**: User tries to access `GET /employees/`.
2.  **Interceptor Logic**:
    - **Step A**: Is the user logged in? (DRF `IsAuthenticated` check).
    - **Step B**: Does the user have `VIEW_EMPLOYEE` code? (Custom `HasPermission` check).
3.  **The Fork**:
    - **IF YES**: `EmployeeListView` queries the database, serializes 10 records, and returns them.
    - **IF NO**: Backend returns `403 Forbidden` with a custom message: _"You do not have the VIEW_EMPLOYEE permission required for this action."_

---

## Workflow 4: The Security Audit Trail

1.  **Action Trigger**: Any view calling `permissions/assign/` or `permissions/remove/`.
2.  **Atomic Recording**: The audit log is saved in the same transaction (logic-wise) as the permission change.
3.  **Transparency**: The `/audit/logs/` endpoint provides a chronological feed of these events.
4.  **UI Feedback**: In the "Dashboard", the latest 8 actions are pulled to show an "Activity Feed," giving real-time visibility into system changes.

---

## Workflow 5: Authentication & Session Strategy

1.  **Token Issuance**: `/auth/login/` provides an Access Token (1 hour) and a Refresh Token (24 hours).
2.  **The "Invisible" Refresh**:
    - Frontend `apiClient.js` intercepts any `401 Unauthorized` responses.
    - It automatically calls `/auth/refresh/` using the stored Refresh Token.
    - If successful, it retries the original failed request with the new token.
    - _Benefit_: The user never sees a "Session Expired" screen unless they have been inactive for over a day.

---

## Sequence Summary

`User` -> `Login (JWT)` -> `Permission Check (HasPermission)` -> `Business Logic (Employees/Dashboard)` -> `Audit Log (Security Trail)`
