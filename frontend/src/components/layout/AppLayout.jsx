import { NavLink, Outlet } from "react-router-dom";
import { LogOut, LayoutDashboard, Briefcase, Users, User, FileText, Menu, X, CreditCard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navLinkClassName = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
    ? "bg-white/20 text-white shadow-inner backdrop-blur-md"
    : "text-white/80 hover:bg-white/10 hover:text-white"
  }`;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="nav-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-110">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Job<span className="text-brand-300">Hub</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/jobs" className={navLinkClassName}>
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </NavLink>

            {user?.role === "admin" && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClassName}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/admin/users" className={navLinkClassName}>
                  <Users className="h-4 w-4" />
                  Users
                </NavLink>
                <NavLink to="/admin/employers" className={navLinkClassName}>
                  <Users className="h-4 w-4" />
                  Employers
                </NavLink>
                <NavLink to="/admin/jobs" className={navLinkClassName}>
                  <Briefcase className="h-4 w-4" />
                  All Jobs
                </NavLink>
                <NavLink to="/admin/payments" className={navLinkClassName}>
                  <CreditCard className="h-4 w-4" />
                  Payments
                </NavLink>
              </>
            )}

            {user?.role === "employer" && (
              <>
                {user.paymentStatus === "paid" ? (
                  <>
                    <NavLink to="/employer/dashboard" className={navLinkClassName}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </NavLink>
                    <NavLink to="/employer/company" className={navLinkClassName}>
                      <Briefcase className="h-4 w-4" />
                      Company
                    </NavLink>
                    <NavLink to="/employer/jobs" className={navLinkClassName}>
                      <FileText className="h-4 w-4" />
                      My Jobs
                    </NavLink>
                    <NavLink to="/employer/applicants" className={navLinkClassName}>
                      <Users className="h-4 w-4" />
                      Applicants
                    </NavLink>
                  </>
                ) : null}
                <NavLink to="/employer/payment" className={navLinkClassName}>
                  <CreditCard className="h-4 w-4" />
                  {user.paymentStatus === "paid" ? "Subscription" : "Pay Now"}
                </NavLink>
              </>
            )}

            {user?.role === "jobseeker" && (
              <>
                <NavLink to="/jobseeker/dashboard" className={navLinkClassName}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/jobseeker/profile" className={navLinkClassName}>
                  <User className="h-4 w-4" />
                  Profile
                </NavLink>
                <NavLink to="/jobseeker/applications" className={navLinkClassName}>
                  <FileText className="h-4 w-4" />
                  Applications
                </NavLink>
              </>
            )}

            <div className="ml-4 flex items-center gap-3 border-l border-white/20 pl-4">
              {!user ? (
                <>
                  <NavLink to="/login" className="text-sm font-medium text-white/90 hover:text-white transition">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-brand-700 shadow-sm transition-all hover:bg-brand-50 hover:shadow-md active:scale-95">
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden rounded-xl bg-white/10 p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-brand-900/95 p-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {/* Mobile links here, simplified for brevity but following same logic */}
              <NavLink to="/jobs" onClick={() => setIsMenuOpen(false)} className={navLinkClassName}>Browse Jobs</NavLink>
              {user && (
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="ui-button-danger mt-4">Logout</button>
              )}
              {!user && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="ui-button-muted">Login</NavLink>
                  <NavLink to="/register" onClick={() => setIsMenuOpen(false)} className="ui-button">Sign Up</NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-slate-500">© 2026 JobHub Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;



