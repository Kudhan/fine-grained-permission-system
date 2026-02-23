# Fine-Grained PS: Frontend Logic & Business Workflows

This document details the operational logic of the frontend—how it interacts with the backend and how the UI provides a secure, intuitive experience.

---

## Workflow 1: The Authentication Handshake

1.  **Submission**: User enters credentials in `LoginPage.jsx`.
2.  **Auth Store Call**: The `login(email, password)` function in `useAuthStore.js` is triggered.
3.  **Token Storage**: On success, the store saves `access_token` and `refresh_token` to `localStorage`.
4.  **Identity Hydration**: The app immediately calls `GET /auth/me/` to fetch the full user profile and their granted permissions.
5.  **Navigation**: The user is pushed to `/dashboard`.

---

## Workflow 2: Granular UI Masking

This is the most critical logic in the system.

1.  **The Component Level**: A restricted component (e.g., the "Delete Employee" button) calls `auth.hasPermission('DELETE_EMPLOYEE')`.
2.  **The Logic Check**: The store checks the internal `user.permissions` array for that specific code.
3.  **The Result**:
    - **Match Found**: The button renders with full functionality.
    - **No Match**: The button is either **hidden** (for high security) or **disabled with a tooltip** (for UX awareness).

---

## Workflow 3: Real-Time Permission Lifecycle

1.  **Administrative Action**: An Admin opens `PermissionManagementPage.jsx`.
2.  **User Selection**: Selecting a user from the directory triggers a fetch for their current state.
3.  **The Toggle**: Clicking "Assign" or "Revoke" calls the specialized backend endpoints.
4.  **Local Sync**: Instead of a full page refresh, the frontend updates the local UI state instantly to show the new Badge/Button status, ensuring high "Perceived Performance."

---

## Workflow 4: The "Protocol" Security Banner (Genesis)

1.  **Secret Route**: The `/genesis` page is a standalone protocol for system initialization.
2.  **Logic**: It bypasses the standard layout to provide a focused, "Terminal-style" experience.
3.  **Provisioning**: It interacts directly with the backend to establish the very first "Root Principle" (Superuser).

---

## Workflow 5: Dynamic Identity Visualization (DiceBear)

1.  **Data Point**: Each user has an `avatar_seed`.
2.  **Real-time Generation**: The `Navbar` and `Profile` pages use this seed to generate a unique "Biometric Identity Profile" from the DiceBear API.
3.  **Human/Robot/Pixel Modes**: In the `ProfilePage.jsx`, users can change their "Identity Seed" to update their visual profile, which is persisted back to the Django database.

---

## Workflow 6: Global Status Monitoring

1.  **Dashboard Polling**: The `Dashboard.jsx` fetches data upon mount.
2.  **Permission-Filtered Stats**:
    - If you can `VIEW_EMPLOYEE`, the "Total Personnel" card appears.
    - If you are an Admin (`ASSIGN_PERMISSION`), the "Audit Activity" feed is populated.
3.  **Security Health calculation**: The dashboard uses purely local React logic to calculate a "System Health Score" based on user activity and permission counts.

---

## Component interaction Sequence

`User Interaction` -> `Component State` -> `Auth Store (Zustand)` -> `Axios Client (api/client.js)` -> `Backend API` -> `Toast Notification (Sonner)`
