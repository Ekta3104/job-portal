import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
};

const styleMap = {
    success:
        "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10",
    error: "bg-rose-50 border-rose-200 text-rose-800 shadow-rose-500/10",
    warning:
        "bg-amber-50 border-amber-200 text-amber-800 shadow-amber-500/10",
    info: "bg-sky-50 border-sky-200 text-sky-800 shadow-sky-500/10",
};

const iconColorMap = {
    success: "text-emerald-500",
    error: "text-rose-500",
    warning: "text-amber-500",
    info: "text-sky-500",
};

const progressMap = {
    success: "bg-emerald-400",
    error: "bg-rose-400",
    warning: "bg-amber-400",
    info: "bg-sky-400",
};

const Toast = ({ id, message, type = "info", duration = 4000, onClose }) => {
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(interval);
        }, 30);

        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 350);
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(onClose, 350);
    };

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-xl backdrop-blur-sm transition-all duration-350 ${styleMap[type]
                } ${exiting
                    ? "translate-x-[120%] opacity-0 scale-95"
                    : "translate-x-0 opacity-100 scale-100 animate-toast-in"
                }`}
            role="alert"
        >
            <span className={`mt-0.5 shrink-0 ${iconColorMap[type]}`}>
                {iconMap[type]}
            </span>
            <p className="flex-1 text-sm font-semibold leading-snug">{message}</p>
            <button
                onClick={handleClose}
                className="shrink-0 rounded-lg p-1 opacity-60 transition-all hover:opacity-100 hover:bg-black/5"
                aria-label="Dismiss"
            >
                <X className="h-4 w-4" />
            </button>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-4 right-4 h-0.5 overflow-hidden rounded-full bg-black/5">
                <div
                    className={`h-full rounded-full transition-none ${progressMap[type]}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default Toast;
