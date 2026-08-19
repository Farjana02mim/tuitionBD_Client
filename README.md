# 🎓 Tuition Management System - Frontend Client

Single Page Application (SPA) for the Tuition Management System built with React, Vite, Tailwind CSS, DaisyUI, Framer Motion, and Firebase Authentication.

---

## 🛠️ Technology Stack

- **Framework**: React 18 & Vite
- **UI & CSS**: Tailwind CSS, DaisyUI
- **State & Server Queries**: TanStack React Query (`@tanstack/react-query`)
- **HTTP Client**: Axios with JWT/Firebase Bearer token interceptor
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Visualizations**: Recharts
- **Authentication**: Firebase Client SDK

---

## 📁 Directory Structure

```
client/
├── src/
│   ├── components/       # Reusable components (Navbar, Footer, Modals, Loaders)
│   ├── hooks/            # Custom hooks (useAuth, useRole, useAxiosSecure)
│   ├── layouts/          # MainLayout & DashboardLayout
│   ├── pages/            # Public & Protected View Components
│   │   ├── Dashboard/    # Student, Tutor, Admin dashboards & pages
│   ├── providers/        # AuthProvider & Context
│   ├── routes/           # Protected Route guards (PrivateRoute, AdminRoute, etc.)
│   └── firebase/         # Firebase Client config
├── .env.example          # Environment variables template
├── package.json
└── vite.config.ts
```

---

## ⚙️ Client Environment Variables

Create `.env` inside `client/`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tuition-management.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tuition-management
VITE_FIREBASE_STORAGE_BUCKET=tuition-management.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_API_URL=http://localhost:3000
```
