import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://edumedia-hub-1-bgw0.onrender.com/api/v1/users/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Login failed");

      const token = data.token || data.accessToken || data.data?.accessToken;
      const role = data.user?.role || data.data?.user?.role;

      if (!token || !role) throw new Error("Invalid server response");

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);

      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
      else navigate("/unauthorized");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-8 border border-neutral-800 shadow-2xl shadow-cyan-400/10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to your EduMedia Tech account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 pr-10 text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-400 hover:text-cyan-300 transition"
              >
                {showPass ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-2.5 font-semibold hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Don’t have an account?{" "}
          <a href="/register" className="font-medium text-cyan-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}