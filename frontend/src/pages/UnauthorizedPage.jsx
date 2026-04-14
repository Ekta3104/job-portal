import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6 text-center">
      <div className="space-y-8 animate-fade-in">
        <div className="relative mx-auto h-32 w-32">
          <div className="absolute inset-0 animate-pulse rounded-full bg-rose-100 opacity-20" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ShieldAlert className="h-16 w-16" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Security Alert</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Access Restricted</h1>
          <p className="mx-auto max-w-sm text-lg text-slate-500">
            Your current account tier does not have the necessary clearance to access this module.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="ui-button flex items-center gap-2 border-none bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800"
          >
            <Home className="h-4 w-4" /> Exit to Safety
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
