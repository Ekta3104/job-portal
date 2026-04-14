import { useEffect, useState } from "react";
import { Search, MapPin, Building2, Clock, Briefcase, Filter, ChevronRight } from "lucide-react";
import { jobService } from "../services/job.service";
import { applicationService } from "../services/application.service";
import { useAuth } from "../context/AuthContext";

const JobsListPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [submittingId, setSubmittingId] = useState("");

  const loadJobs = async (searchText = "") => {
    try {
      setLoading(true);
      setError("");
      const { data } = await jobService.getJobs({ q: searchText || undefined, limit: 20 });
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const onSearch = (event) => {
    event.preventDefault();
    loadJobs(query.trim());
  };

  const onApply = async (jobId) => {
    try {
      setSubmittingId(jobId);
      await applicationService.applyToJob(jobId, {});
      alert("Application submitted successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Could not submit application");
    } finally {
      setSubmittingId("");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Opportunities</h1>
          <p className="text-lg text-slate-500">Discover your next career move among our curated listings.</p>
        </div>
      </div>

      <div className="rounded-3xl bg-brand-600 p-8 shadow-2xl shadow-brand-500/20 md:p-10">
        <form onSubmit={onSearch} className="flex flex-col gap-4 md:flex-row">
          <div className="search-bar-container group flex-1 bg-white/10 border-white/20 focus-within:bg-white">
            <div className="search-bar-icon-wrapper text-white group-focus-within:text-brand-600">
              <Search className="h-5 w-5" />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Job title, company, or keywords..."
              className="search-bar-input text-white group-focus-within:text-slate-900 placeholder:text-brand-100 group-focus-within:placeholder:text-slate-400"
            />
          </div>
          <button className="rounded-2xl bg-white px-8 py-4 text-sm font-bold text-brand-600 transition-all hover:bg-brand-50 active:scale-95" type="submit">
            Search Jobs
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-center text-rose-700 shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ui-card h-40 animate-pulse bg-slate-100/50" />
          ))
        ) : jobs.length === 0 ? (
          <div className="ui-card py-20 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <Briefcase className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium text-slate-900">No jobs found</p>
            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <article key={job._id} className="ui-card hover:translate-x-1 animate-slide-up transition-all group">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {job.company?.name || "Company"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        Posted 2 days ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user?.role === "jobseeker" ? (
                    <button
                      type="button"
                      onClick={() => onApply(job._id)}
                      disabled={submittingId === job._id}
                      className="ui-button px-6"
                    >
                      {submittingId === job._id ? "Applying..." : "Apply Now"}
                    </button>
                  ) : (
                    <button className="ui-button-muted group/btn flex items-center gap-2">
                      View Details
                      <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="line-clamp-2 text-slate-600 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsListPage;



