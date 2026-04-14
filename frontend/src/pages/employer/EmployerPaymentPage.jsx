import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    CreditCard,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Building,
    Zap,
    Star,
    Crown,
    AlertCircle,
    Clock,
    BadgeCheck,
} from "lucide-react";
import { paymentService } from "../../services/payment.service";
import { useAuth } from "../../context/AuthContext";

const PLANS = [
    {
        id: "basic",
        label: "Basic Plan",
        price: 999,
        jobs: 5,
        icon: Zap,
        color: "violet",
        features: ["5 Job Postings", "30-day Listing", "Email Support", "Basic Analytics"],
    },
    {
        id: "standard",
        label: "Standard Plan",
        price: 2499,
        jobs: 20,
        icon: Star,
        color: "blue",
        popular: true,
        features: ["20 Job Postings", "60-day Listing", "Priority Support", "Advanced Analytics", "Featured Listings"],
    },
    {
        id: "premium",
        label: "Premium Plan",
        price: 4999,
        jobs: "Unlimited",
        icon: Crown,
        color: "amber",
        features: ["Unlimited Job Postings", "90-day Listing", "24/7 Dedicated Support", "Full Analytics Suite", "Featured + Pinned Listings", "Candidate Shortlisting"],
    },
];

const EmployerPaymentPage = () => {
    const location = useLocation();
    const { user, updateUser } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState("basic");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [existingPayment, setExistingPayment] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState("pending");
    const [step, setStep] = useState("plan"); // plan | success
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const { data } = await paymentService.getMyPayment();
                if (data.payment && data.payment.status === "completed") {
                    setExistingPayment(data.payment);
                    setSelectedPlan(data.payment.plan || "basic");
                    setStep("success");
                }
                setApprovalStatus(data.approvalStatus || "pending");
            } catch (err) {
                console.error("Error fetching payment status:", err);
            } finally {
                setPageLoading(false);
            }
        };
        fetchPayment();
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePay = async () => {
        setError("");
        setLoading(true);

        try {
            // 1. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                setError("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            // 2. Create Order on Backend
            const { data } = await paymentService.initiatePayment({ plan: selectedPlan });
            const { order, key_id } = data;

            const plan = PLANS.find(p => p.id === selectedPlan);

            // 3. Open Razorpay Checkout
            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: "JobHub Portal",
                description: `${plan.label} Subscription`,
                image: "/logo.png", // Replace with your actual logo
                order_id: order.id,
                handler: async function (response) {
                    try {
                        setLoading(true);
                        // 4. Verify Signature on Backend
                        const verifyRes = await paymentService.verifyRazorpaySignature({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            setExistingPayment(verifyRes.data.payment);
                            setApprovalStatus(verifyRes.data.employerApprovalStatus || "pending");
                            setStep("success");
                            if (verifyRes.data.user) {
                                updateUser(verifyRes.data.user);
                            }
                        }
                    } catch (err) {
                        setError(err?.response?.data?.message || "Payment verification failed.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.fullName,
                    email: user?.email,
                    contact: user?.phone || "",
                },
                notes: {
                    address: "JobHub Corporate Office",
                },
                theme: {
                    color: "#6366f1", // Match your brand color
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            setError(err?.response?.data?.message || "Could not initiate payment. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const plan = PLANS.find((p) => p.id === selectedPlan) || PLANS[0];

    if (pageLoading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Employer Subscription
                </h1>
                <p className="text-lg text-slate-500">
                    Choose a plan and complete payment via Razorpay to unlock job posting.
                </p>
            </div>

            {step === "plan" && location.state?.fromRegister && (
                <div className="rounded-2xl bg-brand-50 border-2 border-brand-200 p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-brand-100 p-3 rounded-xl">
                        <Building className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-900">Welcome to JobHub!</h3>
                        <p className="text-brand-800/80 font-medium">
                            We're excited to have you on board. To start posting job opportunities and finding the best talent, please purchase a subscription plan below.
                        </p>
                    </div>
                </div>
            )}

            {step === "plan" && !location.state?.fromRegister && (
                <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-amber-100 p-3 rounded-xl">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-amber-900">Subscription Required</h3>
                        <p className="text-amber-800/80 font-medium">
                            You need to purchase a subscription to post jobs. Choose a plan that fits your needs to get started.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Approval Status Banner */}
            {step === "success" && (
                <div
                    className={`flex items-center gap-4 rounded-2xl border p-5 ${approvalStatus === "approved"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                >
                    {approvalStatus === "approved" ? (
                        <BadgeCheck className="h-8 w-8 shrink-0 text-emerald-500" />
                    ) : (
                        <Clock className="h-8 w-8 shrink-0 text-amber-500" />
                    )}
                    <div>
                        <p className="font-bold">
                            {approvalStatus === "approved"
                                ? "🎉 Your payment is received! You can post jobs now."
                                : approvalStatus === "suspicious"
                                    ? "Payment received, but your account is under manual review due to suspicious data."
                                    : "Payment received! Awaiting automated/admin verification before job posting is unlocked."}
                        </p>
                        <p className="text-sm mt-0.5 opacity-75">
                            {approvalStatus === "approved"
                                ? "Admin Verified: Approved"
                                : approvalStatus === "suspicious"
                                    ? "Status: Pending Review (Suspicious Data flagged)"
                                    : "Status: Pending Verification"}
                        </p>
                    </div>
                </div>
            )}

            {/* Step: Plan Selection */}
            {step === "plan" && (
                <>
                    <div className="grid gap-6 md:grid-cols-3">
                        {PLANS.map((p) => {
                            const Icon = p.icon;
                            const isSelected = selectedPlan === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPlan(p.id)}
                                    className={`relative flex flex-col rounded-3xl border-2 p-7 text-left transition-all hover:-translate-y-1 ${isSelected
                                        ? "border-brand-500 bg-brand-50 shadow-xl shadow-brand-500/10"
                                        : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-lg"
                                        }`}
                                >
                                    {p.popular && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                                            Most Popular
                                        </span>
                                    )}
                                    <div
                                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${isSelected ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30" : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{p.label}</h3>
                                    <div className="mt-1 mb-5">
                                        <span className="text-3xl font-black text-slate-900">₹{p.price.toLocaleString()}</span>
                                        <span className="ml-1 text-sm text-slate-400">/one-time</span>
                                    </div>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        {p.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    {isSelected && (
                                        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-600">
                                            <CheckCircle2 className="h-4 w-4" /> Selected
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-end gap-6 items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span>Secure Razorpay Checkout</span>
                        </div>
                        <button
                            onClick={handlePay}
                            disabled={loading}
                            className="ui-button-primary px-10 h-12 flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <CreditCard className="h-5 w-5" />
                            )}
                            Pay ₹{plan.price.toLocaleString()} via Razorpay
                        </button>
                    </div>
                </>
            )}

            {/* Step: Success */}
            {step === "success" && existingPayment && (
                <div className="ui-card space-y-6 max-w-2xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Payment Confirmed!</h2>
                            <p className="text-slate-500">Your payment was successfully processed via Razorpay.</p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                        <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs">Transaction Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Plan</p>
                                <p className="font-bold text-slate-900 capitalize">{existingPayment.plan}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Amount Paid</p>
                                <p className="font-bold text-slate-900">₹{existingPayment.amount?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Razorpay Order ID</p>
                                <p className="font-mono text-xs text-slate-700">{existingPayment.razorpayOrderId}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Razorpay Payment ID</p>
                                <p className="font-mono text-xs text-slate-700">{existingPayment.razorpayPaymentId}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Status</p>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                                    {existingPayment.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Account Status</p>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${approvalStatus === "approved"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : approvalStatus === "suspicious"
                                            ? "bg-rose-100 text-rose-700"
                                            : "bg-amber-100 text-amber-700"
                                        }`}
                                >
                                    {approvalStatus === "approved" ? "Admin Verified: Approved" : approvalStatus === "suspicious" ? "Suspicious: Manual Review" : "Pending Approval"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${approvalStatus === "approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>
                            {approvalStatus === "approved"
                                ? "Your account is fully verified and active. You have full access to all employer features."
                                : "Admin will verify your payment and approve your account. Once approved, you can start posting jobs."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerPaymentPage;
