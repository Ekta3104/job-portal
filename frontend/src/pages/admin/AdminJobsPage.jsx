import { useEffect, useState } from "react";
import { Briefcase, Building2, MapPin, Loader2, Search, Filter, ShieldCheck, Mail, Calendar } from "lucide-react";
import { adminService } from "../../services/admin.service";

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getAllJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.company?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Content Moderation</h1>
          <p className="text-slate-500">Monitor and audit all job listings published across the platform.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="search-bar-container group h-10 w-full md:w-64">
            <div className="search-bar-icon-wrapper">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ui-select h-10 text-sm"
          >
            <option value="all">Every Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.length === 0 ? (
            <div className="ui-card col-span-full py-20 text-center text-slate-500 italic">
              No job listings match your audit criteria.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <article key={job._id} className="ui-card group relative p-6 transition-all hover:border-brand-500/30">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${job.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {job.status || 'Active'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <Building2 className="h-4 w-4 text-slate-400" /> {job.company?.name || "Independent"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Posted 3d ago
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Auditor Context</p>
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{job.employer?.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;



