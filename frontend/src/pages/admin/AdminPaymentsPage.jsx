import { useEffect, useState } from "react";
import {
    CreditCard,
    CheckCircle2,
    Loader2,
    IndianRupee,
    TrendingUp,
    ShieldCheck,
    Clock,
    XCircle,
    Eye,
    Search,
    BadgeCheck,
} from "lucide-react";
import { paymentService } from "../../services/payment.service";
import { adminService } from "../../services/admin.service";

const AdminPaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null); // payment object
    const [approving, setApproving] = useState(null); // userId

    const loadData = async () => {
        try {
            setLoading(true);
            const [paymentsRes, statsRes] = await Promise.all([
                paymentService.getAllPayments(filterStatus ? { status: filterStatus } : {}),
                paymentService.getPaymentStats(),
            ]);
            setPayments(paymentsRes.data.payments || []);
            setStats(statsRes.data.stats || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filterStatus]);

    const handleVerify = async (paymentId) => {
        if (!window.confirm("Mark this payment as admin-verified?")) return;
        try {
            await paymentService.verifyPayment(paymentId);
            setModal(null);
            loadData();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to verify payment");
        }
    };

    const handleApproveEmployer = async (userId) => {
        if (!window.confirm("Approve this employer to post jobs?")) return;
        setApproving(userId);
        try {
            await adminService.setEmployerApproval(userId, "approved");
            loadData();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to approve employer");
        } finally {
            setApproving(null);
        }
    };

    const filteredPayments = payments.filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            p.employer?.fullName?.toLowerCase().includes(q) ||
            p.employer?.email?.toLowerCase().includes(q) ||
            p.transactionId?.toLowerCase().includes(q)
        );
    });

    const statusBadge = (status) => {
        const cfg = {
            completed: "bg-emerald-100 text-emerald-700",
            pending: "bg-amber-100 text-amber-700",
            failed: "bg-rose-100 text-rose-700",
            refunded: "bg-slate-100 text-slate-600",
        };
        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg[status] || "bg-slate-100 text-slate-600"}`}>
                <span className={`h-1.5 w-1.5 rounded-full inline-block ${status === "completed" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : "bg-rose-500"}`} />
                {status}
            </span>
        );
    };

    const approvalBadge = (status) => {
        const cfg = {
            approved: "bg-emerald-100 text-emerald-700",
            pending: "bg-amber-100 text-amber-700",
            rejected: "bg-rose-100 text-rose-700",
        };
        return (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg[status] || "bg-slate-100 text-slate-600"}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                        Payment Management
                    </h1>
                    <p className="text-lg text-slate-500">
                        Review employer payments and approve accounts.
                    </p>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: "Total Revenue",
                            value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
                            icon: IndianRupee,
                            color: "emerald",
                        },
                        {
                            label: "Completed Payments",
                            value: stats.completedPayments,
                            icon: CheckCircle2,
                            color: "blue",
                        },
                        {
                            label: "Pending Payments",
                            value: stats.pendingPayments,
                            icon: Clock,
                            color: "amber",
                        },
                        {
                            label: "Admin Verified",
                            value: stats.verifiedPayments,
                            icon: ShieldCheck,
                            color: "violet",
                        },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div
                            key={label}
                            className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-${color}-50 text-${color}-600`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                                <p className="text-3xl font-black text-slate-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or transaction ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="ui-card py-20 text-center text-slate-500 italic">
                    No payments found.
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50">
                            <tr>
                                {["Employer", "Plan", "Amount", "Payment Status", "Acct. Approval", "Verified", "Actions"].map((h) => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPayments.map((p) => (
                                <tr key={p._id} className="group transition-colors hover:bg-slate-50/60">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{p.employer?.fullName || "—"}</div>
                                        <div className="text-xs text-slate-400">{p.employer?.email || "—"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 capitalize">
                                            {p.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ₹{p.amount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                                    <td className="px-6 py-4">
                                        {approvalBadge(p.employer?.employerApprovalStatus || "pending")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.verifiedByAdmin ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                <BadgeCheck className="h-4 w-4" /> Yes
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">No</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setModal(p)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {p.status === "completed" && p.employer?.employerApprovalStatus !== "approved" && (
                                                <button
                                                    onClick={() => handleApproveEmployer(p.employer?._id)}
                                                    disabled={approving === p.employer?._id}
                                                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all disabled:opacity-60"
                                                    title="Approve Employer"
                                                >
                                                    {approving === p.employer?._id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    )}
                                                    Approve
                                                </button>
                                            )}
                                            {p.employer?.employerApprovalStatus === "approved" && (
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                                    <BadgeCheck className="h-3 w-3" /> Approved
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl space-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                            <button
                                onClick={() => setModal(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                            {[
                                ["Employer", modal.employer?.fullName],
                                ["Email", modal.employer?.email],
                                ["Plan", modal.plan],
                                ["Amount", `₹${modal.amount?.toLocaleString()}`],
                                ["Payment Method", modal.paymentMethod],
                                ["Transaction ID", modal.transactionId],
                                ["Payment Status", modal.status],
                                ["Account Approval", modal.employer?.employerApprovalStatus],
                                ["Admin Verified", modal.verifiedByAdmin ? "Yes" : "No"],
                                ["Paid At", modal.paidAt ? new Date(modal.paidAt).toLocaleString() : "N/A"],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-semibold">{label}</span>
                                    <span className="font-bold text-slate-900 capitalize">{value || "—"}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            {!modal.verifiedByAdmin && modal.status === "completed" && (
                                <button
                                    onClick={() => handleVerify(modal._id)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700 transition"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Mark as Verified
                                </button>
                            )}
                            {modal.status === "completed" && modal.employer?.employerApprovalStatus !== "approved" && (
                                <button
                                    onClick={() => {
                                        handleApproveEmployer(modal.employer?._id);
                                        setModal(null);
                                    }}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve Employer
                                </button>
                            )}
                            <button
                                onClick={() => setModal(null)}
                                className="ui-button-muted px-6"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsPage;
