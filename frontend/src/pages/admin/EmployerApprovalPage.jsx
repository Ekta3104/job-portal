import { useEffect, useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  Mail,
  ShieldCheck,
  Clock,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import { adminService } from "../../services/admin.service";

const EmployerApprovalPage = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getUsers({ role: "employer" });
      setEmployers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  const updateApproval = async (userId, approvalStatus) => {
    if (!window.confirm(`Are you sure you want to set status to ${approvalStatus}?`)) return;
    try {
      await adminService.setEmployerApproval(userId, approvalStatus);
      loadEmployers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update approval status");
    }
  };

  const paymentBadge = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          <IndianRupee className="h-3 w-3" /> Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
        <AlertCircle className="h-3 w-3" /> Unpaid
      </span>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Employer Verifications
        </h1>
        <p className="text-lg text-slate-500">
          Review employer payments and grant access. Employers must complete payment before they can be approved.
        </p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid gap-6">
          {employers.length === 0 ? (
            <div className="ui-card py-20 text-center text-slate-500 italic">
              No employer accounts found in the verification queue.
            </div>
          ) : (
            employers.map((employer) => (
              <article
                key={employer._id}
                className="ui-card group animate-slide-up transition-all hover:border-brand-500/30"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Employer Info */}
                  <div className="flex gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">{employer.fullName}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Mail className="h-4 w-4 text-slate-400" /> {employer.email}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] ${employer.employerApprovalStatus === "approved"
                              ? "text-emerald-600"
                              : employer.employerApprovalStatus === "rejected"
                                ? "text-rose-600"
                                : "text-amber-600"
                            }`}
                        >
                          {employer.employerApprovalStatus === "pending" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          {employer.employerApprovalStatus}
                        </span>
                        {/* Payment Status badge */}
                        {paymentBadge(employer.paymentStatus)}
                      </div>

                      {/* Warning if payment not done */}
                      {employer.paymentStatus !== "paid" && (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 font-medium">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          Employer has not completed payment. Approval will be blocked until payment is made.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 border-t pt-6 lg:border-t-0 lg:pt-0">
                    <button
                      onClick={() => updateApproval(employer._id, "approved")}
                      disabled={
                        employer.employerApprovalStatus === "approved" ||
                        employer.paymentStatus !== "paid"
                      }
                      title={
                        employer.paymentStatus !== "paid"
                          ? "Payment required before approval"
                          : ""
                      }
                      className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-all ${employer.employerApprovalStatus === "approved"
                          ? "bg-emerald-50 text-emerald-600 cursor-not-allowed"
                          : employer.paymentStatus !== "paid"
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-white text-slate-600 hover:bg-emerald-600 hover:text-white border border-slate-200 hover:border-emerald-600"
                        }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Verify Company
                    </button>

                    <button
                      onClick={() => updateApproval(employer._id, "rejected")}
                      disabled={employer.employerApprovalStatus === "rejected"}
                      className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-all ${employer.employerApprovalStatus === "rejected"
                          ? "bg-rose-50 text-rose-600 cursor-not-allowed"
                          : "bg-white text-slate-600 hover:bg-rose-600 hover:text-white border border-slate-200 hover:border-rose-600"
                        }`}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
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

export default EmployerApprovalPage;
