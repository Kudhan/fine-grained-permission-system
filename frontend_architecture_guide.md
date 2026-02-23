# Fine-Grained Permission System: Frontend Architecture & UI Guide

This document provides a comprehensive breakdown of the frontend architecture for the **Fine-Grained Permission System**. It explains how the React application is structured, how it manages state, and how it delivers a premium, "Executive" user experience.

---

## 1. System Philosophy & UI Objective

The frontend is designed to be **"Identity-Aware"**. Every part of the UI—from a sidebar link to a "Delete" button—responds dynamically to the user's specific granular permissions.

- **Premium Aesthetics**: Using a high-contrast industrial design (Light/Dark support) to convey a sense of "Absolute Authority."
- **Institutional UX**: Layouts inspired by modern enterprise dashboards (Stripe, Vercel) to ensure professionalism.
- **Micro-Animations**: Extensive use of `framer-motion` to make the system feel alive and responsive.

---

## 2. Technical Stack

- **Framework**: React 18+ (Vite-based)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (Auth & UI State)
- **Navigation**: React Router DOM v6
- **API Client**: Axios (with custom interceptors)
- **UI Components**: Radix UI (via Shadcn-UI patterns)
- **Notifications**: Sonner (Toast system)
- **Dynamic Avatars**: DiceBear API (Biometric identity seeds)

---

## 3. Core Directory Structure

The project is organized in `/frontend/src/` for maximum clarity:

### 📄 `pages/` (The Views)

- **`LandingPage.jsx`**: The high-end, public entrance with a Bento-Grid layout.
- **`Dashboard.jsx`**: The central hub showing real-time health scores and activity feeds.
- **`PermissionManagementPage.jsx`**: The "Access Control" directory where identities are provisioned.
- **`GenesisPage.jsx`**: A special, "Secret" protocol page for initial system establishment.

### 🏗️ `components/` (The Building Blocks)

- **`layout/`**: Contains `Navbar.jsx` and `Sidebar.jsx`, which handle the global application shell.
- **`ui/`**: Low-level, reusable primitives like `Button`, `Input`, `Card`, and `Badge`.

### 🪝 `hooks/` (The Logic)

- **`useAuthStore.js`**: The central brain. It persists user data, handles login/logout, and provides the `hasPermission('CODE')` helper globally.

### 🌐 `api/` (The Connection)

- **`client.js`**: A centralized Axios instance that automatically attaches JWT tokens to every request and handles token refreshing.

---

## 4. Key Architectural Patterns

### 1. Global Authentication Store (Zustand)

Instead of complex Context Providers, the app uses a **Zustand Auth Store**. This store is "Persisted," meaning if the user refreshes the page, their session remains active without a flicker.

- **`user`**: The current identity object.
- **`hasPermission(permCode)`**: A critical helper that components use to conditionally render UI elements.

### 2. Intelligent Protected Routes

The `App.jsx` uses a `ProtectedRoute` wrapper.

- If a user isn't logged in, they are redirected to `/login`.
- If a user is logged in, the `Layout` component wraps their view, providing the Sidebar and Navbar automatically.

### 3. The "Invisible" API Shield (`client.js`)

We use **Axios Interceptors** to act as a bridge between the frontend and backend:

- **Request Interceptor**: Automatically adds `Authorization: Bearer <token>` if a token is present in LocalStorage.
- **Response Interceptor**: If the backend returns a `401 Unauthorized` (expired token), the interceptor calls the refresh endpoint, updates the token, and **retries the original request** silently.

---

## 5. UI Design Language

- **Color Palette**: Focused on "Slate" and "Primary" (Blue/White) to maintain a clean, industrial look.
- **Dark Mode First**: The system defaults to dark mode (using the `dark` class on `html`) to reduce eye strain for security analysts.
- **Bento Geometry**: Large cards with rounded corners (`rounded-[2rem]`) and subtle borders to organize dense data.
- **Iconography**: Centered around **Biometrics (Fingerprint)** and **Hard Security (Shields, Locks)** to reinforce the fine-grained permission branding.

---

## 6. Deployment Readiness

The frontend is configured for instant deployment:

- **`.env.production`**: Maps the `VITE_API_URL` to the production backend.
- **`vercel.json` / `_redirects`**: Configured for Single Page Application (SPA) routing, ensuring internal links work even on server refresh.
- **Asset Optimization**: Vite handles tree-shaking and CSS minification for ultra-fast load times.
