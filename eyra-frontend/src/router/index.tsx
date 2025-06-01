import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./paths";

// Layouts
import RootLayout from "../layouts/RootLayout";

// Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OnboardingPage from "../pages/OnboardingPage";
import DashboardPage from "../pages/DashboardPage";
import CalendarPage from "../pages/CalendarPage";
import ProfilePage from "../pages/ProfilePage";
import ErrorPage from "../pages/ErrorPage";
import AdminPage from "../pages/AdminPage";
import LogoutPage from "../pages/LogoutPage";
import SettingsPage from "../pages/SettingsPage";
import LibraryPage from "../pages/LibraryPage";

// Restricciones para rutas
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RoleRoute from "./RoleRoute";
import AuthGuard from "../components/auth/AuthGuard";
import TrackingPage from "../pages/TrackingPage";

// Router simplificado sin layouts duplicados
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Rutas públicas
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
        path: ROUTES.LOGOUT,
        element: <LogoutPage />,
      },

      // Onboarding (protegido pero sin requerir onboarding completado)
      {
        path: ROUTES.ONBOARDING,
        element: (
          <ProtectedRoute requireOnboarding={false}>
            <AuthGuard blockIfOnboarded>
              <OnboardingPage />
            </AuthGuard>
          </ProtectedRoute>
        ),
      },

      // Rutas autenticadas - todas bajo el mismo layout
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CALENDAR,
        element: (
          <PublicOnlyRoute>
            <CalendarPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.TRACKING,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <TrackingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.LIBRARY,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <LibraryPage />
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
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute requireOnboarding={true}>
            <SettingsPage />
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
    ],
  },
]);

export default router;
