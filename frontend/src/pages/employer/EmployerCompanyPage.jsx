import { useEffect, useState } from "react";
import { Building2, Globe, MapPin, Users, Loader2, Save, CheckCircle, Image as ImageIcon, Briefcase, UserCircle } from "lucide-react";
import { companyService } from "../../services/company.service";

const initialForm = {
  name: "",
  website: "",
  location: "",
  description: "",
  logoUrl: "",
  employeeCount: "1-10",
  industry: "",
};

const EmployerCompanyPage = () => {
  const [form, setForm] = useState(initialForm);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMyCompany = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await companyService.getMyCompany();
      if (data?.company) {
        setCompanyId(data.company._id);
        setForm({
          name: data.company.name || "",
          website: data.company.website || "",
          location: data.company.location || "",
          description: data.company.description || "",
          logoUrl: data.company.logoUrl || "",
          employeeCount: data.company.employeeCount || "1-10",
          industry: data.company.industry || "",
        });
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        setError(err?.response?.data?.message || "Failed to load company profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCompany();
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (companyId) {
        const { data } = await companyService.updateMyCompany(form);
        setMessage(data.message || "Company profile updated successfully");
      } else {
        const { data } = await companyService.createCompany(form);
        setCompanyId(data.company?._id || "");
        setMessage(data.message || "Company profile created successfully");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save company profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Company Branding</h1>
        <p className="text-lg text-slate-500">Define your organization's presence and values to attract top talent.</p>
      </div>

      {loading ? (
        <div className="ui-card flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Brand Preview */}
          <div className="lg:col-span-1 space-y-6">
            <div className="ui-card flex flex-col items-center p-8 text-center overflow-hidden">
              <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 group overflow-hidden">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Logo" className="h-full w-full object-contain p-4" />
                ) : (
                  <Building2 className="h-12 w-12" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{form.name || "Company Name"}</h3>
              <p className="text-sm font-medium text-brand-600 mb-6">{form.industry || "Industry"}</p>
              <div className="flex flex-col w-full gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                  <Users className="h-3.5 w-3.5" /> {form.employeeCount} team members
                </div>
                {form.website && (
                  <a href={form.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-brand-600 justify-center font-bold hover:underline">
                    <Globe className="h-3.5 w-3.5" /> visit website
                  </a>
                )}
              </div>
            </div>

            <div className="ui-card p-6 bg-slate-900 text-white border-none">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-2">Pro Tip</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Companies with complete profiles and clear descriptions get up to 3x more quality applications.
              </p>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2">
            <form className="ui-card p-8 space-y-8" onSubmit={onSubmit}>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Company Name</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="name" value={form.name} onChange={onChange} required className="ui-input pl-12" placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Industry</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="industry" value={form.industry} onChange={onChange} className="ui-input pl-12" placeholder="Technology" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Website URL</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="website" value={form.website} onChange={onChange} className="ui-input pl-12" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Headquarters</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="location" value={form.location} onChange={onChange} className="ui-input pl-12" placeholder="Remote / City" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Logo Link</label>
                    <div className="relative group">
                      <ImageIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="logoUrl" value={form.logoUrl} onChange={onChange} className="ui-input pl-12" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Company Size</label>
                    <div className="relative group">
                      <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
                      <select name="employeeCount" value={form.employeeCount} onChange={onChange} className="ui-select pl-12">
                        <option value="1-10">Self-employed (1-10)</option>
                        <option value="11-50">Startup (11-50)</option>
                        <option value="51-200">Growth (51-200)</option>
                        <option value="201-500">Enterprise (201-500)</option>
                        <option value="500+">Large (500+)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">About the Company</label>
                  <textarea name="description" value={form.description} onChange={onChange} className="ui-textarea" placeholder="Describe your mission, culture, and what you do..." rows={6} />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                {error && <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 animate-fade-in">{error}</div>}
                {message && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-600 animate-fade-in">
                    <CheckCircle className="h-4 w-4" />
                    {message}
                  </div>
                )}
                <button type="submit" disabled={saving} className="ui-button w-full sm:w-auto self-end">
                  {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saving ? "Publishing..." : companyId ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerCompanyPage;
