import { Link } from "react-router-dom";
import { Briefcase, FileText, User, ArrowRight, Zap, Target } from "lucide-react";

const JobSeekerDashboardPage = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Candidate Hub</h1>
          <p className="text-lg text-slate-500">Welcome back! Manage your career journey from one place.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/jobs"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-500/30 text-white">
              <Briefcase className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Explore Jobs</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Find the perfect role matching your skills and aspirations.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-brand-600">
              Browse Listings <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          to="/jobseeker/applications"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white">
              <FileText className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Applications</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Monitor the status of your sent applications in real-time.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
              View History <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          to="/jobseeker/profile"
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-50 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 shadow-lg shadow-amber-500/30 text-white">
              <User className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">My Profile</h2>
            <p className="mb-4 text-slate-500 leading-relaxed">
              Update your information and keep your resume up to date.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-amber-600">
              Manage Profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>

      <div className="rounded-[2rem] bg-slate-900 p-8 md:p-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Need help with your search?</h2>
            <p className="text-lg text-slate-400">
              Our career experts are here to help you optimize your profile and land your next big role.
            </p>
            <button className="ui-button bg-white text-slate-900 hover:bg-slate-100 shadow-none">
              Speak with a Guide
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
              <Zap className="h-8 w-8 text-brand-400" />
              <div className="text-sm">
                <div className="font-bold text-white">Instant Alerts</div>
                <div className="text-slate-400">Get notified as soon as a match is found.</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
              <Target className="h-8 w-8 text-emerald-400" />
              <div className="text-sm">
                <div className="font-bold text-white">Smart Match</div>
                <div className="text-slate-400">Our AI finds roles tailored to your experience.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboardPage;



