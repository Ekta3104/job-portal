import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Briefcase, Users, ArrowRight, TrendingUp, Filter, CreditCard, Clock } from "lucide-react";
import { getEmployerStats } from "../../services/stats.service";

const EmployerDashboardPage = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getEmployerStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Error fetching employer stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Hiring Command Center</h1>
          <p className="text-lg text-slate-500">Manage your company presence and recruitment funnel.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/employer/company"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-500/30 text-white">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Company Brand</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Enhance your profile to attract the best industry talent.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-brand-600">
              Edit Profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          to="/employer/jobs"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-500/30 text-white">
              <Briefcase className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Active Listings</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Post new roles or manage your existing job openings.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-violet-600">
              Manage Jobs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          to="/employer/applicants"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Candidate Pool</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Review resumes and move candidates through your pipeline.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
              View Applicants <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          to="/employer/payment"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white">
              <CreditCard className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Subscription</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Complete payment to unlock job posting after admin approval.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
              Manage Payment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>

      <div className="rounded-[2rem] bg-slate-50 border border-slate-200 p-8 md:p-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Active Jobs</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900">{loading ? "..." : stats.activeJobs}</span>
              <span className="mb-1 text-xs font-bold text-indigo-600 flex items-center bg-indigo-50 px-1.5 py-0.5 rounded-md">
                Live
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Applicants</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900">{loading ? "..." : stats.totalApplicants}</span>
              <span className="mb-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Lifetime</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-400">Pending Review</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900">{loading ? "..." : stats.pendingApplications}</span>
              <span className="mb-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Action Needed
              </span>
            </div>
          </div>
          <div className="space-y-2 text-right">
            <Link to="/employer/applicants" className="ui-button-muted h-full w-full lg:w-auto flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;



