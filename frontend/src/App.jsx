import { Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import FitnessTracker from "./pages/FitnessTracker";
import Rewards from "./pages/Rewards";
import AIAssistant from "./pages/AIAssistant";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-blue-200">
      {/* Global Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none z-0"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/symptom"
            element={
              <ProtectedRoute>
                <SymptomChecker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fitness"
            element={
              <ProtectedRoute>
                <FitnessTracker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
