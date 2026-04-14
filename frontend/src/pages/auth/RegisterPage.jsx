import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader2, ArrowRight, Briefcase, Building2, UserCircle, Globe, Building, Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "jobseeker",
    companyName: "",
    websiteUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailToVerify, setEmailToVerify] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await authService.register(form);

      if (data.requiresOTP) {
        setEmailToVerify(data.email);
        setShowOTP(true);
      } else {
        login({ token: data.token, user: data.user });
        if (data.user.role === "employer") {
          navigate("/employer/payment", { state: { fromRegister: true } });
        } else {
          navigate("/jobseeker/dashboard");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await authService.verifyOtp({ email: emailToVerify, otp });
      login({ token: data.token, user: data.user });

      if (data.user.role === "employer") {
        navigate("/employer/payment", { state: { fromRegister: true } });
      } else {
        navigate("/jobseeker/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      await authService.resendOtp({ email: emailToVerify });
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-500/20 text-white">
            <UserCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900">Create account</h2>
          <p className="mt-3 text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="ui-card p-8 shadow-2xl shadow-slate-200/50">
          {!showOTP ? (
            <form className="space-y-6" onSubmit={onSubmit}>
              {error && (
                <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      name="fullName"
                      type="text"
                      required
                      className="ui-input pl-12"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="ui-input pl-12"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="ui-input pl-12"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role: "jobseeker" }))}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${form.role === "jobseeker"
                        ? "border-brand-500 bg-brand-50 text-brand-700 ring-4 ring-brand-500/10"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      <Briefcase className="h-6 w-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role: "employer" }))}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${form.role === "employer"
                        ? "border-brand-500 bg-brand-50 text-brand-700 ring-4 ring-brand-500/10"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      <Building2 className="h-6 w-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Employer</span>
                    </button>
                  </div>
                </div>

                {form.role === "employer" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Company Name</label>
                      <div className="relative group">
                        <Building className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                        <input
                          name="companyName"
                          type="text"
                          required={form.role === "employer"}
                          className="ui-input pl-12"
                          placeholder="Tech Solutions Inc."
                          value={form.companyName}
                          onChange={onChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Website URL</label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                        <input
                          name="websiteUrl"
                          type="url"
                          required={form.role === "employer"}
                          className="ui-input pl-12"
                          placeholder="https://example.com"
                          value={form.websiteUrl}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ui-button w-full group"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="space-y-6 animate-fade-in" onSubmit={onVerifyOtp}>
              {error && (
                <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 animate-fade-in">
                  {error}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Verify your Email</h3>
                <p className="text-sm text-slate-500 mt-2">
                  We've sent a 6-digit code to <span className="font-semibold text-slate-700">{emailToVerify}</span>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Enter OTP</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="ui-input pl-12 text-center tracking-widest font-mono text-lg"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="ui-button w-full group"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={loading}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;



