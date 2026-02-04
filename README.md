# Micro Tasking and Earning Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for micro-tasking and earning.

## Features

### 🎯 Three User Roles
- **Worker**: Complete tasks and earn coins
- **Buyer**: Create tasks and manage submissions
- **Admin**: Manage users and platform operations

### 💼 Core Functionality
- User authentication with JWT
- Task creation and management
- Task submission and review system
- Coin-based payment system
- Real-time notifications
- Transaction history
- Role-based access control

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Vite
- React Router DOM
- Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
cd PH-Assignment-13
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables
```bash
cd ../backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

5. Start MongoDB (if running locally)
```bash
mongod
```

6. Start the backend server
```bash
cd backend
npm run dev
```

7. Start the frontend development server
```bash
cd frontend
npm run dev
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Buyer only)
- `PATCH /api/tasks/:id` - Update task (Buyer only)
- `DELETE /api/tasks/:id` - Delete task (Buyer only)

### Submissions
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Submit task (Worker only)
- `PATCH /api/submissions/:id/review` - Review submission (Buyer only)

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions/purchase` - Purchase coins (Buyer only)
- `POST /api/transactions/withdraw` - Withdraw coins (Worker only)

### Users & Admin
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/stats` - Get platform statistics (Admin only)
- `PATCH /api/users/:id/toggle-status` - Toggle user status (Admin only)
- `GET /api/users/notifications` - Get notifications
- `PATCH /api/users/notifications/:id/read` - Mark notification as read

## Project Structure

```
PH-Assignment-13/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Entry point
│   └── .env            # Environment variables
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   └── App.jsx      # Main app component
    └── package.json
```

## License

ISC
