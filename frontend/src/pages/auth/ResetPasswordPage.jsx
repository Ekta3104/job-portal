import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, ShieldCheck, Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { authService } from "../../services/auth.service";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Security check: Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await authService.resetPassword(token, { password });
      setMessage(data.message || "Credential update successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to establish new key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Secure Vault</h1>
          <p className="mt-2 text-slate-500">Initialize your new access credentials.</p>
        </div>

        <div className="ui-card p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-sm border-white/60">
          {!message ? (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">New Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="ui-input pl-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Verify Key</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="ui-input pl-12"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-medium text-rose-600 animate-slide-up">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="ui-button w-full shadow-lg shadow-brand-500/20">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Credentials"}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4 animate-scale-up">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Success</h3>
                <p className="text-sm text-slate-500">
                  Your password has been updated. Redirecting to terminal...
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors group">
              Back to Login portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;


