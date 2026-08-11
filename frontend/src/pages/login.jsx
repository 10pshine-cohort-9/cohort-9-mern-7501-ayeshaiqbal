import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sun, Moon, BookOpen } from "lucide-react";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const inputClass =
    "w-full h-[42px] rounded-lg border px-3 outline-none text-sm transition-all";

  const fieldClass = darkMode
    ? `${inputClass} bg-[#2F1D32] border-[#593750] text-white placeholder:text-[#9E899F] focus:border-[#C837AB]`
    : `${inputClass} bg-[#F3F4F6] border-[#D9DDE3] text-[#111827] placeholder:text-[#8B93A0] focus:border-[#A855F7]`;

  const iconClass = darkMode ? "text-[#D2C4D3]" : "text-[#7D8795]";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#08060C]" : "bg-white"
      }`}
    >
      <header
        className={`h-[58px] border-b transition-colors duration-300 ${
          darkMode
            ? "bg-[#09070E] border-white/[0.08]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2.5">
            <BookOpen
              size={25}
              strokeWidth={2}
              aria-hidden="true"
              className={darkMode ? "text-white" : "text-[#111827]"}
            />
            <span
              className={`text-[20px] font-bold tracking-tight ${
                darkMode ? "text-white" : "text-[#111827]"
              }`}
            >
              Notes App
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
              darkMode
                ? "border-white/10 bg-white/[0.04] text-yellow-300 hover:bg-white/[0.08]"
                : "border-gray-200 bg-white text-[#7C3AED] hover:bg-gray-50"
            }`}
          >
            {darkMode ? (
              <Sun size={17} aria-hidden="true" />
            ) : (
              <Moon size={17} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <main className="flex justify-center px-4 py-7">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-4">
            <h1
              className={`text-[22px] leading-tight font-bold tracking-tight ${
                darkMode ? "text-white" : "text-[#111827]"
              }`}
            >
              Sign In
            </h1>
            <p
              className={`mt-1 text-[14px] font-medium ${
                darkMode ? "text-white" : "text-[#1F2937]"
              }`}
            >
              Welcome Back
            </p>
            <p
              className={`mt-1 text-[12px] ${
                darkMode ? "text-[#918599]" : "text-[#737B87]"
              }`}
            >
              Log in to your Notes App account
            </p>
          </div>

          <div
            className={`rounded-xl border p-4.5 transition-colors duration-300 ${
              darkMode
                ? "bg-[#0E0A14] border-[#251A2C] shadow-xl shadow-black/30"
                : "bg-white border-gray-200 shadow-lg shadow-gray-200/50"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="login-email"
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode ? "text-white" : "text-[#172033]"
                  }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    aria-hidden="true"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${fieldClass} pl-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode ? "text-white" : "text-[#172033]"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    aria-hidden="true"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${fieldClass} pl-10 pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-[#C8B9C9] hover:text-white"
                        : "text-[#7D8795] hover:text-[#7C3AED]"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <label
                htmlFor="remember-me"
                className={`flex items-center gap-2 text-[11px] cursor-pointer pt-0.5 ${
                  darkMode ? "text-[#9E91A3]" : "text-[#69717D]"
                }`}
              >
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#C837AB]"
                />
                Remember me
              </label>

              {error && (
                <p className="text-red-400 text-[12px] text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full h-[42px] rounded-lg bg-gradient-to-r from-[#D21CFF] via-[#913CF5] to-[#477BFF] text-white text-[13px] font-semibold shadow-md shadow-purple-500/20 hover:brightness-110 active:scale-[0.99] transition-all"
              >
                Sign In
              </button>
            </form>
          </div>

          <p
            className={`text-[12px] text-center mt-3 ${
              darkMode ? "text-[#8E8195]" : "text-[#707783]"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#C837AB] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;

