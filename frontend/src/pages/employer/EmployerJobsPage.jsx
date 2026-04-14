import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, MapPin, Briefcase, Clock, AlertCircle, Loader2, CheckCircle, Building2 } from "lucide-react";
import { jobService } from "../../services/job.service";
import { companyService } from "../../services/company.service";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  location: "",
  jobType: "full-time",
  experienceLevel: "fresher",
  companyId: "",
};

const EmployerJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [success, setSuccess] = useState("");

  const myJobs = useMemo(() => jobs.filter((job) => job.employer?._id === user?._id), [jobs, user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data } = await jobService.getJobs({ limit: 50 });
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

  useEffect(() => {
    const loadMyCompany = async () => {
      try {
        const { data } = await companyService.getMyCompany();
        if (data?.company?._id) {
          setForm((prev) => ({ ...prev, companyId: data.company._id }));
          setCompanyError("");
        }
      } catch (err) {
        setCompanyError(
          err?.response?.status === 404
            ? "Create your company profile first before posting jobs."
            : "Failed to load company profile. Please check your connection."
        );
      }
    };

    loadMyCompany();
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setSuccess("");
      await jobService.createJob(form);
      setForm((prev) => ({ ...initialForm, companyId: prev.companyId }));
      loadJobs();
      setSuccess("Job listing published successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await jobService.deleteJob(jobId);
      loadJobs();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
        {/* Left Side: Create Form */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Post a Job</h1>
              <p className="text-slate-500">Fill in the details to find your next great hire.</p>
            </div>

            <form onSubmit={onSubmit} className="ui-card p-6 space-y-5 shadow-xl shadow-slate-200/50 backdrop-blur-sm border-white/60">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
                <input name="title" value={form.title} onChange={onChange} className="ui-input" placeholder="e.g. Senior React Developer" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                <textarea name="description" value={form.description} onChange={onChange} className="ui-textarea h-32" placeholder="Responsibilities, requirements..." required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                  <input name="location" value={form.location} onChange={onChange} className="ui-input pl-10" placeholder="e.g. Remote / New York" required />
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Type</label>
                  <select name="jobType" value={form.jobType} onChange={onChange} className="ui-select text-xs pr-2">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Ex. Level</label>
                  <select name="experienceLevel" value={form.experienceLevel} onChange={onChange} className="ui-select text-xs pr-2">
                    <option value="fresher">Fresher</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {companyError && (
                  <div className="flex items-center gap-2 rounded-xl bg-orange-50 p-3 text-xs font-medium text-orange-700">
                    <AlertCircle className="h-4 w-4" />
                    {companyError}
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                    {success}
                  </div>
                )}
                <button type="submit" disabled={submitting || !form.companyId} className="ui-button w-full">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 mr-2" />}
                  {submitting ? "Publishing..." : "Post Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Job List */}
        <div className="lg:flex-1">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Your Active Roles</h2>
              <div className="ui-badge">{myJobs.length} Positions</div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="ui-card h-32 animate-pulse bg-slate-100/50" />
                ))
              ) : myJobs.length === 0 ? (
                <div className="ui-card py-20 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium text-slate-900">No active postings</p>
                  <p className="text-slate-500">Your published roles will appear here.</p>
                </div>
              ) : (
                myJobs.map((job) => (
                  <article key={job._id} className="ui-card group animate-slide-up transition-all hover:border-brand-500/30">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                              <Briefcase className="h-3 w-3" /> {job.jobType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> 2h ago
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${job.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {job.status || 'Active'}
                        </div>
                        <button
                          type="button"
                          onClick={() => onDelete(job._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobsPage;

