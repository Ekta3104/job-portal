import { useEffect, useState } from "react";
import { Clock, Building2, MapPin, CheckCircle, XCircle, AlertCircle, Loader2, Briefcase } from "lucide-react";
import { applicationService } from "../../services/application.service";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
    accepted: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    rejected: "bg-rose-50 text-rose-700 ring-rose-600/10",
  };

  const icons = {
    pending: <Clock className="h-3 w-3" />,
    accepted: <CheckCircle className="h-3 w-3" />,
    rejected: <XCircle className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${styles[status] || styles.pending}`}>
      {icons[status] || icons.pending}
      {status}
    </span>
  );
};

const JobSeekerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const { data } = await applicationService.getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Applied Roles</h1>
        <p className="text-lg text-slate-500">Track the status of your recent career applications.</p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center text-rose-700">
          <AlertCircle className="mx-auto mb-2 h-8 w-8" />
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.length === 0 ? (
            <div className="ui-card py-20 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <Briefcase className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium text-slate-900">No applications yet</p>
              <p className="text-slate-500">Your applied roles will appear here once you start applying.</p>
            </div>
          ) : (
            applications.map((app) => (
              <article key={app._id} className="ui-card group hover:translate-x-1 animate-slide-up transition-all">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <Building2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {app.job?.title || "Position Title"}
                      </h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="font-medium text-slate-700">
                          {app.job?.company?.name || "Company Name"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {app.job?.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Applied on Mar 03, 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 md:justify-end">
                    <StatusBadge status={app.status} />
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

export default JobSeekerApplicationsPage;



