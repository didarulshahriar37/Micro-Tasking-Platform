import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import WorkerDashboard from './pages/WorkerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddTask from './pages/AddTask';
import MyTasks from './pages/MyTasks';
import PurchaseCoin from './pages/PurchaseCoin';
import PaymentHistory from './pages/PaymentHistory';
import TaskList from './pages/TaskList';
import TaskDetails from './pages/TaskDetails';
import MySubmissions from './pages/MySubmissions';
import Withdrawals from './pages/Withdrawals';
import ManageUsers from './pages/ManageUsers';
import ManageTasks from './pages/ManageTasks';
import PaymentSuccess from './pages/PaymentSuccess';
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './pages/NotFound';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      {/* Worker Routes */}
      <Route
        path="/worker/*"
        element={
          <ProtectedRoute allowedRoles={['worker']}>
            <Routes>
              <Route index element={<WorkerDashboard />} />
              <Route path="task-list" element={<TaskList />} />
              <Route path="task/:id" element={<TaskDetails />} />
              <Route path="my-submissions" element={<MySubmissions />} />
              <Route path="withdrawals" element={<Withdrawals />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Buyer Routes */}
      <Route
        path="/buyer/*"
        element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Routes>
              <Route index element={<BuyerDashboard />} />
              <Route path="add-task" element={<AddTask />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="purchase-coin" element={<PurchaseCoin />} />
              <Route path="payment-history" element={<PaymentHistory />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-right" reverseOrder={false} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
