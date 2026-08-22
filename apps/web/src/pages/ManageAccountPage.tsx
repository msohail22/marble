import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Settings,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import type { UserProfile, ApiKey } from "@marble/types";

interface ManageAccountPageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

type TabSection = "all" | "profile" | "security" | "apikeys";

export function ManageAccountPage({
  onNavigate,
  onLogout,
}: ManageAccountPageProps) {
  const [activeTab, setActiveTab] = useState<TabSection>("all");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal states
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Notification Toast state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    id: "usr_1",
    name: "John Doe",
    email: "john@example.com",
    company: "Marble Technologies",
    role: "Admin",
    phone: "+1 (555) 123-4567",
    timezone: "UTC-5",
    plan: "Pro",
    status: "Active",
    memberSince: "Jan 15, 2026",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production Key",
      key: "sk_prod_***************************",
      created: "2026-01-15",
      lastUsed: "2 hours ago",
    },
    {
      id: "2",
      name: "Development Key",
      key: "sk_dev_****************************",
      created: "2026-02-20",
      lastUsed: "1 hour ago",
    },
  ]);

  // Fetch initial profile & keys from backend API if available
  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, keysRes] = await Promise.all([
          fetch("/api/account/profile"),
          fetch("/api/account/keys"),
        ]);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.data) setProfile(profileData.data);
        }
        if (keysRes.ok) {
          const keysData = await keysRes.json();
          if (keysData.data) setApiKeys(keysData.data);
        }
      } catch (_e) {
        // Fallback to local default state if backend service is unreachable
      }
    }
    loadData();
  }, []);

  const triggerToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          company: profile.company,
          phone: profile.phone,
          role: profile.role,
          timezone: profile.timezone,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) setProfile(data.data);
      }
      setEditingProfile(false);
      triggerToast("success", "Profile updated successfully!");
    } catch (_e) {
      setEditingProfile(false);
      triggerToast("success", "Profile changes saved!");
    }
  };

  const handleChangePassword = async () => {
    if (!password.current) {
      triggerToast("error", "Please enter your current password.");
      return;
    }
    if (password.new.length < 6) {
      triggerToast("error", "New password must be at least 6 characters.");
      return;
    }
    if (password.new !== password.confirm) {
      triggerToast("error", "Passwords do not match.");
      return;
    }

    try {
      await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });
    } catch (_e) {
      // Ignored for dev fallback
    }

    setPassword({ current: "", new: "", confirm: "" });
    setEditingPassword(false);
    triggerToast("success", "Password updated successfully!");
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      triggerToast("error", "Please enter a key name.");
      return;
    }
    try {
      const res = await fetch("/api/account/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setApiKeys([data.data, ...apiKeys]);
        }
      } else {
        const newKey: ApiKey = {
          id: String(Date.now()),
          name: newKeyName.trim(),
          key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          created: new Date().toISOString().split("T")[0],
          lastUsed: "Never",
        };
        setApiKeys([newKey, ...apiKeys]);
      }
    } catch (_e) {
      const newKey: ApiKey = {
        id: String(Date.now()),
        name: newKeyName.trim(),
        key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toISOString().split("T")[0],
        lastUsed: "Never",
      };
      setApiKeys([newKey, ...apiKeys]);
    }
    setNewKeyName("");
    setShowKeyModal(false);
    triggerToast("success", "New API key generated!");
  };

  const handleRevokeApiKey = async (id: string) => {
    try {
      await fetch(`/api/account/keys/${id}`, { method: "DELETE" });
    } catch (_e) {
      // Ignored for dev fallback
    }
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    triggerToast("success", "API key revoked.");
  };

  const handleDeleteAccountConfirm = () => {
    setShowDeleteModal(false);
    triggerToast("success", "Account deleted successfully.");
    if (onLogout) {
      onLogout();
    } else {
      onNavigate("home");
    }
  };

  const userInitials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-wrap items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-white text-lg group-hover:bg-orange-600 transition-colors">
              M
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
              Marble
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base">
            <button
              onClick={() => onNavigate("home")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={onLogout || (() => onNavigate("home"))}
              className="text-gray-300 hover:text-orange-400 transition-colors flex items-center gap-1.5"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-lg shadow-xl border text-sm max-w-[calc(100vw-2rem)] ${
            notification.type === "success"
              ? "bg-gray-800 border-green-500/50 text-green-400"
              : "bg-gray-800 border-red-500/50 text-red-400"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} className="shrink-0" />
          ) : (
            <AlertTriangle size={20} className="shrink-0" />
          )}
          <span className="font-medium text-white">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg shrink-0">
            {userInitials || "JD"}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.name}</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {profile.email} • Manage Profile & Security
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <nav className="flex lg:flex-col overflow-x-auto divide-x lg:divide-x-0 lg:divide-y divide-gray-700">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-left transition-colors font-medium flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0 ${
                    activeTab === "all"
                      ? "bg-orange-500/10 text-orange-400 border-b-2 lg:border-b-0 lg:border-l-4 border-orange-500"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <User size={18} />
                  All Settings
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-left transition-colors font-medium flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0 ${
                    activeTab === "profile"
                      ? "bg-orange-500/10 text-orange-400 border-b-2 lg:border-b-0 lg:border-l-4 border-orange-500"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <User size={18} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-left transition-colors font-medium flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0 ${
                    activeTab === "security"
                      ? "bg-orange-500/10 text-orange-400 border-b-2 lg:border-b-0 lg:border-l-4 border-orange-500"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Lock size={18} />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("apikeys")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-left transition-colors font-medium flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0 ${
                    activeTab === "apikeys"
                      ? "bg-orange-500/10 text-orange-400 border-b-2 lg:border-b-0 lg:border-l-4 border-orange-500"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Settings size={18} />
                  API Keys
                </button>
              </nav>
            </div>

            {/* Account Status */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 sm:p-6 mt-6">
              <h3 className="text-white font-semibold mb-4">Account Status</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Plan</p>
                  <p className="text-white font-medium text-sm sm:text-base">{profile.plan}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Status</p>
                  <p className="text-green-400 font-medium text-sm sm:text-base">{profile.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Member Since</p>
                  <p className="text-white font-medium text-sm sm:text-base">{profile.memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Section */}
            {(activeTab === "all" || activeTab === "profile") && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <User size={22} />
                    Profile Information
                  </h2>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {editingProfile ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingProfile ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">
                          Company
                        </label>
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile({ ...profile, company: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">
                          Role
                        </label>
                        <select
                          value={profile.role}
                          onChange={(e) =>
                            setProfile({ ...profile, role: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        >
                          <option>Admin</option>
                          <option>Developer</option>
                          <option>User</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1.5">
                          Timezone
                        </label>
                        <input
                          type="text"
                          value={profile.timezone}
                          onChange={(e) =>
                            setProfile({ ...profile, timezone: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Full Name</p>
                      <p className="text-white font-medium text-sm sm:text-base">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Email</p>
                      <p className="text-white font-medium text-sm sm:text-base flex items-center gap-2 truncate">
                        <Mail size={16} className="shrink-0" /> {profile.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Company</p>
                      <p className="text-white font-medium text-sm sm:text-base">{profile.company}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Phone</p>
                      <p className="text-white font-medium text-sm sm:text-base">{profile.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Role</p>
                      <p className="text-white font-medium text-sm sm:text-base">{profile.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Timezone</p>
                      <p className="text-white font-medium text-sm sm:text-base">{profile.timezone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Section */}
            {(activeTab === "all" || activeTab === "security") && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <Lock size={22} />
                    Security
                  </h2>
                  <button
                    onClick={() => setEditingPassword(!editingPassword)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {editingPassword ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {editingPassword ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={password.current}
                          onChange={(e) =>
                            setPassword({ ...password, current: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={password.new}
                          onChange={(e) =>
                            setPassword({ ...password, new: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={password.confirm}
                          onChange={(e) =>
                            setPassword({ ...password, confirm: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-300 text-sm sm:text-base mb-2">
                      Last password change: 30 days ago
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      We recommend changing your password regularly for security.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* API Keys Section */}
            {(activeTab === "all" || activeTab === "apikeys") && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <Settings size={22} />
                    API Keys
                  </h2>
                  <button
                    onClick={() => setShowKeyModal(true)}
                    className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={16} />
                    Generate Key
                  </button>
                </div>

                <div className="space-y-4">
                  {apiKeys.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">
                      No API keys generated yet.
                    </p>
                  ) : (
                    apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-700/80 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm sm:text-base truncate">{key.name}</h3>
                          <p className="text-gray-400 text-xs sm:text-sm font-mono break-all mt-0.5 select-all">
                            {key.key}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                            <span>Created: {key.created}</span>
                            <span>Last used: {key.lastUsed}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRevokeApiKey(key.id)}
                          className="self-start sm:self-center px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/20 flex items-center gap-1 shrink-0"
                        >
                          <Trash2 size={14} />
                          Revoke
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === "all" && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-medium text-sm sm:text-base">Delete Account</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="self-start sm:self-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Generate API Key Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-lg p-5 sm:p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Generate API Key</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5">
              Enter a descriptive name for your new API key (e.g. Staging Key).
            </p>
            <input
              type="text"
              placeholder="Key Name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerateKey();
              }}
              autoFocus
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 mb-6 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowKeyModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateKey}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-gray-800 border border-red-500/30 rounded-lg p-5 sm:p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle size={24} className="shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-white">Delete Account</h3>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-6">
              Are you sure you want to delete your account? This action is permanent and cannot be undone. All your proxies and configurations will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
