import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight, Briefcase, Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { authService } from "../../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailToVerify, setEmailToVerify] = useState("");

  const onUpdateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await authService.login(formData);

      if (data.requiresOTP) {
        setEmailToVerify(data.email);
        setShowOTP(true);
      } else {
        login({ token: data.token, user: data.user });
        if (data.user.role === "employer" && data.user.paymentStatus === "unpaid") {
          navigate("/employer/payment");
        } else if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "employer") {
          navigate("/employer/dashboard");
        } else {
          navigate("/jobseeker/dashboard");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
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

      if (data.user.role === "employer" && data.user.paymentStatus === "unpaid") {
        navigate("/employer/payment");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "employer") {
        navigate("/employer/dashboard");
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await authService.googleLogin({
        idToken: credentialResponse.credential,
      });
      login({ token: data.token, user: data.user });
      if (data.user.role === "employer" && data.user.paymentStatus === "unpaid") {
        navigate("/employer/payment");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/jobseeker/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-500/20 text-white">
            <Briefcase className="h-8 w-8" />
          </div>
          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-3 text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign up today
            </Link>
          </p>
        </div>

        <div className="ui-card p-8 shadow-2xl shadow-slate-200/50">
          {!showOTP ? (
            <>
              <form className="space-y-6" onSubmit={onSubmit}>
                {error && (
                  <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 animate-fade-in">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
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
                        value={formData.email}
                        onChange={onUpdateField}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-sm font-semibold text-slate-700">Password</label>
                      <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input
                        name="password"
                        type="password"
                        required
                        className="ui-input pl-12"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={onUpdateField}
                      />
                    </div>
                  </div>
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
                      Sign in
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google login failed")}
                    theme="outline"
                    shape="pill"
                    size="large"
                    width="100%"
                  />
                </div>
              </div>
            </>
          ) : (
            <form className="space-y-6 animate-fade-in" onSubmit={onVerifyOtp}>
              {error && (
                <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 animate-fade-in">
                  {error}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Two-Step Verification</h3>
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
                    Verify & Sign in
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

export default LoginPage;
