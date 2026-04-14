import { useEffect, useState } from "react";
import { User, Mail, Phone, Briefcase, FileText, Image as ImageIcon, CheckCircle, Loader2, Save, UserCircle, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profile.service";

const initialForm = {
  fullName: "",
  phone: "",
  experienceLevel: "fresher",
  resumeUrl: "",
  profileImage: "",
  bio: "",
  skillsText: "",
};

const JobSeekerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const mapProfileToForm = (profile) => ({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    experienceLevel: profile?.experienceLevel || "fresher",
    resumeUrl: profile?.resumeUrl || "",
    profileImage: profile?.profileImage || "",
    bio: profile?.bio || "",
    skillsText: Array.isArray(profile?.skills) ? profile.skills.join(", ") : "",
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await profileService.getMyProfile();
      if (data?.profile) {
        setForm(mapProfileToForm(data.profile));
        updateUser(data.profile);
      } else {
        setForm(mapProfileToForm(user));
      }
    } catch (err) {
      console.error("Profile load error:", err);
      setError(err?.response?.data?.message || "Failed to load profile. Using local session data.");
      setForm(mapProfileToForm(user));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      fullName: form.fullName,
      phone: form.phone,
      experienceLevel: form.experienceLevel,
      resumeUrl: form.resumeUrl,
      profileImage: form.profileImage,
      bio: form.bio,
      skills: form.skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      const { data } = await profileService.updateMyProfile(payload);
      setMessage(data?.message || "Profile synchronization successful!");
      if (data?.profile) {
        updateUser(data.profile);
        setForm(mapProfileToForm(data.profile));
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to transmit profile updates.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Professional Profile</h1>
          <p className="text-lg text-slate-500">Curate your identity and showcase your industry expertise.</p>
        </div>
      </div>

      {loading ? (
        <div className="ui-card flex h-96 items-center justify-center border-none bg-slate-100/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Encrypting Connection...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="ui-card text-center p-10 overflow-hidden shadow-2xl shadow-indigo-500/5 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-indigo-600" />
              <div className="relative mx-auto mb-8 h-40 w-40">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />
                {form.profileImage ? (
                  <img src={form.profileImage} alt="Avatar" className="relative h-full w-full rounded-full object-cover border-4 border-white shadow-2xl" />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-brand-50 text-brand-600 border-4 border-white shadow-2xl">
                    <UserCircle className="h-20 w-20" />
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">{form.fullName || "Candidate Identity"}</h3>
              <p className="text-sm font-bold text-slate-400 mb-8 flex items-center justify-center gap-2">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="ui-badge bg-indigo-50 text-indigo-700 ring-indigo-500/20 px-4 py-2 text-xs uppercase tracking-widest">{form.experienceLevel} Tier</span>
                <span className="ui-badge bg-emerald-50 text-emerald-700 ring-emerald-500/20 px-4 py-2 text-xs uppercase tracking-widest">Verified</span>
              </div>
            </div>

            <div className="ui-card p-8 space-y-6 bg-slate-900 text-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck className="h-6 w-6 text-brand-400" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest">Security Protocol</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Your professional portfolio is protected by AES-256 encryption. Only verified industry partners with active recruitment licenses can view your sensitive credentials.
              </p>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-8">
            <form className="ui-card p-10 space-y-10 shadow-2xl shadow-slate-200/50" onSubmit={onSubmit}>
              <div className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="fullName" value={form.fullName} onChange={onChange} required className="ui-input h-14 pl-12" placeholder="e.g. Alex Winters" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="phone" value={form.phone} onChange={onChange} className="ui-input h-14 pl-12" placeholder="+1 (415) 555-0123" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Seniority Tier</label>
                    <div className="relative group">
                      <Zap className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
                      <select name="experienceLevel" value={form.experienceLevel} onChange={onChange} className="ui-select h-14 pl-12">
                        <option value="fresher">Fresher / Entry Level</option>
                        <option value="junior">Junior (1-2 years)</option>
                        <option value="mid">Mid-Market (3-5 years)</option>
                        <option value="senior">Senior Executive (5+ years)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Resume Hyperlink</label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                      <input name="resumeUrl" value={form.resumeUrl} onChange={onChange} className="ui-input h-14 pl-12" placeholder="https://cloud.storage/resume.pdf" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Profile Visual Assets</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input name="profileImage" value={form.profileImage} onChange={onChange} className="ui-input h-14 pl-12" placeholder="Paste image CDN URL" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Core Tech Stack (Comma Separated)</label>
                  <input name="skillsText" value={form.skillsText} onChange={onChange} className="ui-input h-14 px-6 font-medium" placeholder="React, Node.js, GraphQL, PostgreSQL..." />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Professional Abstract & Bio</label>
                  <textarea name="bio" value={form.bio} onChange={onChange} className="ui-textarea min-h-[12rem] p-6 leading-relaxed" placeholder="Summarize your professional trajectory, achievements, and unique value proposition..." />
                </div>
              </div>

              <div className="flex flex-col gap-6 pt-6">
                {error && (
                  <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-5 text-sm font-bold text-rose-600 animate-slide-up">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg">!</div>
                    {error}
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-5 text-sm font-bold text-emerald-600 animate-slide-up">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shadow-sm" />
                    {message}
                  </div>
                )}

                <button type="submit" disabled={saving} className="ui-button h-14 w-full shadow-2xl shadow-indigo-500/30 text-base">
                  {saving ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Processing Core Update...
                    </>
                  ) : (
                    <>
                      <Save className="mr-3 h-5 w-5" />
                      Save Professional Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerProfilePage;
