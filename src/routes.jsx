import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LearningPage from "./pages/LearningPage";
import PlayPage from "./pages/PlayPage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AchievementsPage from "./pages/AchievementsPage";
import NotFoundPage from "./pages/NotFoundPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import CountryPage from "./pages/CountryPage";
import AdminPage from './pages/AdminPage';

const AppRoutes = ({ darkMode, toggleDarkMode }) => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/signup"
        element={<SignUpPage />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />
      <Route
        path="/learn"
        element={<LearningPage />}
      />
      <Route
        path="/learn/:id"
        element={<CountryPage />}
      />
      <Route
        path="/country/:id"
        element={<CountryPage />}
      />
      <Route
        path="/play"
        element={<PlayPage />}
      />
      <Route
        path="/play/:quizType/:difficulty"
        element={<QuizPage />}
      />
      <Route
        path="/daily-challenge"
        element={<DailyChallengePage />}
      />
      <Route
        path="/leaderboard"
        element={<LeaderboardPage />}
      />
      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Navigate to="/profile" replace />
          </ProtectedRoute>
        }
      />
      {/* Route protégée avec rôle requis */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      {/* 404 route */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default AppRoutes;
