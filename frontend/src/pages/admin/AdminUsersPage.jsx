import { useEffect, useState } from "react";
import { User, Shield, ShieldOff, Trash2, Mail, Loader2, Search, Filter, ShieldCheck, ShieldAlert } from "lucide-react";
import { adminService } from "../../services/admin.service";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getUsers();
      setUsers(data.users || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBlock = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await adminService.setUserBlocked(user._id, !user.isBlocked);
      loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm("CRITICAL: Are you sure you want to PERMANENTLY delete this account? This cannot be undone.")) return;
    try {
      await adminService.deleteUser(userId);
      loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">User Governance</h1>
          <p className="text-slate-500">Audit accounts, manage permissions, and enforce security policies.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="search-bar-container group h-10 w-full md:w-64">
            <div className="search-bar-icon-wrapper">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar-input"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="ui-select h-10 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="jobseeker">Job Seekers</option>
            <option value="employer">Employers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 p-10 text-center text-rose-700 italic border border-rose-100">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="hidden grid-cols-12 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 lg:grid">
            <div className="col-span-5">Identity</div>
            <div className="col-span-2">System Role</div>
            <div className="col-span-2">Security Status</div>
            <div className="col-span-3 text-right">Goverance Actions</div>
          </div>

          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="ui-card py-20 text-center text-slate-500 italic">
                No users found matching your criteria.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <article key={user._id} className="ui-card group grid grid-cols-1 gap-4 p-5 lg:grid-cols-12 lg:items-center lg:gap-0 lg:p-4">
                  {/* User Info */}
                  <div className="col-span-1 flex items-center gap-4 lg:col-span-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${user.role === 'admin' ? 'bg-brand-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600'
                      }`}>
                      {user.role === 'admin' ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900">{user.fullName}</h3>
                      <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                        <Mail className="h-3 w-3" /> {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="col-span-1 lg:col-span-2">
                    <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-700' :
                      user.role === 'employer' ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      <Shield className="h-3 w-3" /> {user.role}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1 lg:col-span-2">
                    <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${user.isBlocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                      {user.isBlocked ? <ShieldOff className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2 lg:col-span-3">
                    {user.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() => toggleBlock(user)}
                        className={`flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-bold transition-all ${user.isBlocked
                          ? 'bg-amber-50 text-amber-700 hover:bg-emerald-600 hover:text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white'
                          }`}
                        title={user.isBlocked ? "Restore Access" : "Revoke Access"}
                      >
                        {user.isBlocked ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                        <span className="lg:hidden xl:inline">{user.isBlocked ? "Restore" : "Restrict"}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeUser(user._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-600 hover:text-white"
                      title="Destroy Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;



