import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./paths";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout"; 

// Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OnboardingPage from "../pages/OnboardingPage";
import DashboardPage from "../pages/DashboardPage";
import CalendarPage from "../pages/CalendarPage";
import InsightsPage from "../pages/InsightsPage";
import ProfilePage from "../pages/ProfilePage";
import ErrorPage from "../pages/ErrorPage";
import AdminPage from "../pages/AdminPage";
import LogoutPage from "../pages/LogoutPage";

// Restricciones para rutas
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RoleRoute from "./RoleRoute";
import AuthGuard from "../components/auth/AuthGuard";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.ONBOARDING,
        element: (
          <ProtectedRoute>
            <AuthGuard blockIfOnboarded>
              <OnboardingPage />
            </AuthGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.LOGOUT,
        element: <LogoutPage />,
      },
    ],
  },

  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN,
        element: (
          <RoleRoute allowedRoles={["ROLE_ADMIN"]} requireOnboarding={true}>
            <AdminPage />
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.CALENDAR,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INSIGHTS,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <InsightsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
