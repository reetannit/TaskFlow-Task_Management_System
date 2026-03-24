# TaskFlow - Task Management System

A full-stack **Task Management System** built with React, Node.js, Express, and MongoDB. Features include user authentication, task CRUD operations, filtering, search, sorting, pagination, analytics dashboard with charts, dark mode, and responsive design.

![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

---

## ✨ Features

### Core
- **Authentication** — Signup & Login with JWT-based auth and input validation
- **Task Management** — Full CRUD (Create, Read, Update, Delete) + Mark as Complete
- **Task Fields** — Title, Description, Status (Todo/In Progress/Done), Priority (Low/Medium/High), Due Date

### Filtering & Search
- Filter by **status** and **priority**
- **Search** tasks by title (debounced)
- **Sort** by due date, priority, title, or creation date
- **Pagination** with configurable page size

### Analytics Dashboard
- Stats cards: Total, Completed, Pending, Overdue tasks
- **Completion progress bar** with percentage
- **Doughnut chart** for status distribution
- **Bar chart** for priority distribution

### UI/UX
- ✅ Clean, modern UI with **glassmorphism** design
- 🌙 **Dark/Light mode** toggle with persistence
- 📱 **Fully responsive** (desktop, tablet, mobile)
- ⚡ Smooth **micro-animations** and transitions
- 🔔 Toast notifications for all actions
- ⏳ Loading spinners and empty states

### Technical
- Global error handling middleware
- JWT authentication with protected routes
- MongoDB indexes for optimized queries
- Express-validator for input validation
- Axios interceptors for auth token management

---

## 🛠 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 19 + Vite     |
| Backend    | Node.js + Express   |
| Database   | MongoDB + Mongoose  |
| Auth       | JWT + bcryptjs      |
| Charts     | Chart.js            |
| Styling    | Vanilla CSS         |
| Icons      | React Icons         |

---

## 🚀 Setup Steps

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas cloud)
- **npm**

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-interview
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (or edit the existing one):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and get JWT | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes |

**Signup Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/tasks` | Get all tasks (with filters) | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks/:id` | Get a single task | Yes |
| `PUT` | `/api/tasks/:id` | Update a task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |
| `PATCH` | `/api/tasks/:id/complete` | Mark task as done | Yes |
| `GET` | `/api/tasks/analytics/summary` | Get analytics data | Yes |

**GET /api/tasks Query Parameters:**

| Param | Description | Example |
|-------|-------------|---------|
| `status` | Filter by status | `todo`, `in-progress`, `done` |
| `priority` | Filter by priority | `low`, `medium`, `high` |
| `search` | Search by title | `meeting` |
| `sortBy` | Sort field | `dueDate`, `priority`, `createdAt`, `title` |
| `sortOrder` | Sort direction | `asc`, `desc` |
| `page` | Page number | `1` |
| `limit` | Items per page | `10` |

**Create/Update Task Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2025-04-01"
}
```

**Analytics Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "statusBreakdown": { "todo": 5, "in-progress": 3, "done": 7 },
    "priorityBreakdown": { "low": 4, "medium": 6, "high": 5 },
    "completionPercentage": 47,
    "overdueTasks": 2
  }
}
```

---

## 🎨 Design Decisions

### Architecture
- **Separation of Concerns**: Backend follows MVC pattern (Models → Controllers → Routes) with dedicated middleware layer
- **Auth Middleware**: JWT token verified on every protected request, user injected into `req.user`
- **Global Error Handler**: Centralized error handling catches Mongoose validation, duplicate key, cast errors, and JWT errors

### Database
- **MongoDB Indexes**: Compound indexes on `(user, status)`, `(user, priority)`, `(user, dueDate)` for fast filtered queries
- **Text Index**: On task title for efficient search
- **Aggregation Pipeline**: Analytics computed server-side using MongoDB `$group` for optimal performance

### Frontend
- **Context API**: Used for auth state management (no Redux needed for this scope)
- **Debounced Search**: 300ms debounce on search input to avoid excessive API calls
- **Axios Interceptors**: Auto-attach JWT token to requests, auto-redirect on 401
- **Optimistic UX**: Toast notifications provide immediate feedback on all actions

### UI/UX
- **CSS Custom Properties**: Full theming system with dark/light mode via `data-theme` attribute
- **No CSS Framework**: Vanilla CSS for full control and minimal bundle size
- **Mobile-First Responsive**: Sidebar collapses to hamburger menu on mobile
- **Accessibility**: Semantic HTML, proper labels, focus states, keyboard navigable

---

## 📁 Project Structure

```
├── backend/
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── taskController.js    # Task CRUD + analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Task.js              # Task schema + indexes
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── taskRoutes.js        # Task endpoints
│   ├── server.js                # Express app entry
│   ├── .env                     # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js         # Axios instance
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx       # App shell + sidebar
│   │   │   ├── TaskCard.jsx     # Task list item
│   │   │   ├── TaskFilters.jsx  # Filter controls
│   │   │   ├── TaskForm.jsx     # Create/Edit modal
│   │   │   └── Pagination.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx    # Main task view
│   │   │   └── Analytics.jsx    # Charts + stats
│   │   ├── App.jsx              # Routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Design system
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 📄 License

MIT
