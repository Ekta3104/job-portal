import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, FileText, ShieldAlert, Loader2, ArrowRight, TrendingUp, UserCheck, ShieldCheck } from "lucide-react";
import { adminService } from "../../services/admin.service";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const { data } = await adminService.getDashboardStats();
        setStats(data.stats);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">System Control</h1>
          <p className="text-lg text-slate-500">Real-time metrics and platform management tools.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
          <ShieldCheck className="h-4 w-4" /> Root Access Active
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 p-6 text-center text-rose-700 border border-rose-100 italic">
          {error}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Main Stat Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Residents"
              value={stats.totalUsers}
              icon={<Users className="h-6 w-6" />}
              color="blue"
              trend="+14%"
            />
            <StatCard
              label="Active Openings"
              value={stats.openJobs}
              icon={<Briefcase className="h-6 w-6" />}
              color="emerald"
              trend="+5%"
            />
            <StatCard
              label="Total Applications"
              value={stats.totalApplications}
              icon={<FileText className="h-6 w-6" />}
              color="violet"
              trend="+22%"
            />
            <StatCard
              label="Pending Verifications"
              value={stats.pendingEmployers}
              icon={<ShieldAlert className="h-6 w-6" />}
              color="amber"
              trend="Priority"
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Platform Management</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Link
                to="/admin/users"
                className="group ui-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">User Governance</h3>
                <p className="mt-1 text-sm text-slate-500">Manage permissions, roles, and access controls for all accounts.</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest">
                  Enter Module <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                to="/admin/jobs"
                className="group ui-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Content Moderation</h3>
                <p className="mt-1 text-sm text-slate-500">Review, flag, or remove job listings that violate platform standards.</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-widest">
                  Enter Module <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                to="/admin/employers"
                className="group ui-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Employer Verifications</h3>
                <p className="mt-1 text-sm text-slate-500">Verify company credentials and grant employer-tier permissions.</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Enter Module <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }) => {
  const colors = {
    blue: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="ui-card flex items-center justify-between p-6">
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{value}</span>
          <span className={`text-[10px] font-bold ${trend === 'Priority' ? 'text-rose-500' : 'text-emerald-500'} flex items-center`}>
            {trend !== 'Priority' && <TrendingUp className="h-3 w-3 mr-0.5" />} {trend}
          </span>
        </div>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors[color] || colors.blue}`}>
        {icon}
      </div>
    </div>
  );
};

export default AdminDashboardPage;



