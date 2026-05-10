import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Pages
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import { Message } from "./pages/Message";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Wrapped by ProtectedRoute which includes the specific Layout) */}
        <Route path="/" element={<ProtectedRoute><Navigate to="/feed" /></ProtectedRoute>}/>
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>}/>
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>}/>
        <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
