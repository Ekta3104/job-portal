import { useEffect, useMemo, useState } from "react";
import { Users, Mail, Phone, ExternalLink, CheckCircle2, XCircle, Clock, Loader2, Briefcase, Filter } from "lucide-react";
import { jobService } from "../../services/job.service";
import { applicationService } from "../../services/application.service";
import { useAuth } from "../../context/AuthContext";

const EmployerApplicantsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  const myJobs = useMemo(() => jobs.filter((job) => job.employer?._id === user?._id), [jobs, user]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoadingJobs(true);
        const { data } = await jobService.getJobs({ limit: 50 });
        const list = data.jobs || [];
        setJobs(list);

        // Auto-select first job if available
        const first = list.find(j => j.employer?._id === user?._id);
        if (first) {
          setSelectedJobId(first._id);
          loadApplications(first._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, [user?._id]);

  const loadApplications = async (jobId) => {
    if (!jobId) return;
    try {
      setLoadingApps(true);
      const { data } = await applicationService.getApplicationsForJob(jobId);
      setApplications(data.applications || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoadingApps(false);
    }
  };

  const onJobChange = (event) => {
    const jobId = event.target.value;
    setSelectedJobId(jobId);
    loadApplications(jobId);
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status);
      loadApplications(selectedJobId);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Applicant Pipeline</h1>
          <p className="text-lg text-slate-500">Review and manage candidates for your active roles.</p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-80">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
            <Filter className="h-3 w-3" /> Filter by Job
          </label>
          <select
            value={selectedJobId}
            onChange={onJobChange}
            className="ui-select bg-white/50 backdrop-blur-sm"
          >
            <option value="">Select a listing...</option>
            {myJobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} ({job.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {loadingApps ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          </div>
        ) : !selectedJobId ? (
          <div className="ui-card py-20 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <Briefcase className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Job Selected</h2>
            <p className="text-slate-500">Select one of your job listings from the dropdown to view applications.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="ui-card py-20 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Applicants Yet</h2>
            <p className="text-slate-500">Applications for this role will appear here as candidates apply.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <article key={app._id} className="ui-card group animate-slide-up transition-all hover:border-brand-500/30">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Candidate Info */}
                  <div className="flex gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <Users className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">{app.applicant?.fullName}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 hover:text-brand-600 transition-colors cursor-pointer">
                          <Mail className="h-4 w-4" /> {app.applicant?.email}
                        </span>
                        {app.applicant?.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4" /> {app.applicant?.phone}
                          </span>
                        )}
                        <span className={`flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${app.status === 'accepted' ? 'text-emerald-600' :
                            app.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                          <Clock className="h-3 w-3" /> {app.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 border-t pt-6 lg:border-t-0 lg:pt-0">
                    <button
                      onClick={() => updateStatus(app._id, "accepted")}
                      disabled={app.status === 'accepted'}
                      className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-all ${app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed'
                          : 'bg-white text-slate-600 hover:bg-emerald-600 hover:text-white border border-slate-200 hover:border-emerald-600'
                        }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "rejected")}
                      disabled={app.status === 'rejected'}
                      className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-all ${app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-600 cursor-not-allowed'
                          : 'bg-white text-slate-600 hover:bg-rose-600 hover:text-white border border-slate-200 hover:border-rose-600'
                        }`}
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </button>

                    <button
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-brand-600"
                      title="View Resume"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerApplicantsPage;



