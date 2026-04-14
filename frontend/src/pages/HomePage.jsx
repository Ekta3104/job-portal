import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, ShieldCheck, ArrowRight, Zap, Target, Globe, Rocket, Sparkles, Star } from "lucide-react";
import { getStats } from "../services/stats.service";

const HomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-24 text-center md:px-12 md:py-40 shadow-2xl shadow-indigo-900/20">
        {/* Dynamic Background Blurs */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-500/30 blur-[120px] animate-pulse" />
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-brand-400/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-5xl space-y-10 animate-slide-up">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Global Talent Network Active</span>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl lg:text-8xl leading-[0.9]">
            Find Your Dream Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-400 to-indigo-600">Build Your Future</span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-slate-400 md:text-2xl font-medium leading-relaxed opacity-90">
            Connect with top companies, discover verified opportunities,
            and take the next step in your career journey.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-10">
            <Link to="/jobs" className="ui-button px-10 py-5 text-lg shadow-2xl shadow-brand-500/40 hover:-translate-y-1 transition-transform">
              Explore Opportunities
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 lowercase tracking-widest">
              Create Account
            </Link>
          </div>

          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center justify-center gap-2"><Globe className="h-5 w-5" /> <span className="text-xs font-bold uppercase tracking-widest">Global Reach</span></div>
            <div className="flex items-center justify-center gap-2"><Rocket className="h-5 w-5" /> <span className="text-xs font-bold uppercase tracking-widest">Rapid Hiring</span></div>
            <div className="flex items-center justify-center gap-2"><Sparkles className="h-5 w-5" /> <span className="text-xs font-bold uppercase tracking-widest">AI Matching</span></div>
            <div className="flex items-center justify-center gap-2"><Star className="h-5 w-5" /> <span className="text-xs font-bold uppercase tracking-widest">Prime Talent</span></div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-7xl px-6 animate-fade-in [animation-delay:400ms]">
        <div className="text-center mb-24 space-y-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-600">The Ecosystem</p>
          <h2 className="text-4xl font-black text-slate-900 md:text-6xl tracking-tight">Purpose-built for growth.</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium">Three specialized interface tiers optimized for your specific role in the talent economy.</p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div className="ui-card p-10 group bg-white border-slate-100 hover:border-brand-500/30">
            <div className="mb-10 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-600 transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
              <Zap className="h-10 w-10" />
            </div>

            <h3 className="mb-4 text-2xl font-black text-slate-900 tracking-tight">Job Seekers</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Discover jobs tailored to your skills, track applications in real time, and connect directly with verified employers.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Explore Path <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          <div className="ui-card p-10 group bg-white border-slate-100 hover:border-brand-500/30">
            <div className="mb-10 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-600 transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
              <Target className="h-10 w-10" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-slate-900 tracking-tight">Enterprise</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Post jobs, manage applications efficiently, and hire the right candidates faster with powerful tools.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Scale Teams <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          <div className="ui-card p-10 group bg-white border-slate-100 hover:border-brand-500/30">
            <div className="mb-10 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-600 transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-slate-900 tracking-tight">Administrators</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Monitor platform activity, manage users and employers,
              and ensure a secure and smooth hiring experience.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Control Center <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white rounded-[3.5rem] p-16 md:p-32 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 h-64 w-64 bg-indigo-600/10 blur-[100px]" />

        <div className="grid gap-20 text-center md:grid-cols-4 relative z-10">
          <div className="space-y-3">
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-400 tabular-nums">
              {stats.totalApplications.toLocaleString()}+
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Global Applications</div>
          </div>
          <div className="space-y-3">
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums">
              {stats.totalCompanies.toLocaleString()}+
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Active Companies</div>
          </div>
          <div className="space-y-3">
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-400 tabular-nums">
              {stats.totalUsers.toLocaleString()}+
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Active Users</div>
          </div>
          <div className="space-y-3">
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums">
              {stats.totalJobs.toLocaleString()}+
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Open Jobs</div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;
