import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import HomePage from "../pages/HomePage";
import JobsListPage from "../pages/JobsListPage";
import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminJobsPage from "../pages/admin/AdminJobsPage";
import EmployerApprovalPage from "../pages/admin/EmployerApprovalPage";
import AdminPaymentsPage from "../pages/admin/AdminPaymentsPage";
import EmployerDashboardPage from "../pages/employer/EmployerDashboardPage";
import EmployerCompanyPage from "../pages/employer/EmployerCompanyPage";
import EmployerJobsPage from "../pages/employer/EmployerJobsPage";
import EmployerApplicantsPage from "../pages/employer/EmployerApplicantsPage";
import EmployerPaymentPage from "../pages/employer/EmployerPaymentPage";
import JobSeekerDashboardPage from "../pages/jobseeker/JobSeekerDashboardPage";
import JobSeekerProfilePage from "../pages/jobseeker/JobSeekerProfilePage";
import JobSeekerApplicationsPage from "../pages/jobseeker/JobSeekerApplicationsPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import PaymentRoute from "./PaymentRoute";

const RedirectByRole = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "employer") {
    if (user.paymentStatus === "unpaid") {
      return <Navigate to="/employer/payment" replace />;
    }
    return <Navigate to="/employer/dashboard" replace />;
  }

  return <Navigate to="/jobseeker/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsListPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="dashboard" element={<RedirectByRole />} />

        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminUsersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/jobs"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminJobsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/employers"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <EmployerApprovalPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/payments"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminPaymentsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="employer/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employer"]}>
                <PaymentRoute>
                  <EmployerDashboardPage />
                </PaymentRoute>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/company"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employer"]}>
                <PaymentRoute>
                  <EmployerCompanyPage />
                </PaymentRoute>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/jobs"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employer"]}>
                <PaymentRoute>
                  <EmployerJobsPage />
                </PaymentRoute>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/applicants"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employer"]}>
                <PaymentRoute>
                  <EmployerApplicantsPage />
                </PaymentRoute>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="employer/payment"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employer"]}>
                <EmployerPaymentPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="jobseeker/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <JobSeekerDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="jobseeker/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <JobSeekerProfilePage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="jobseeker/applications"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["jobseeker"]}>
                <JobSeekerApplicationsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
