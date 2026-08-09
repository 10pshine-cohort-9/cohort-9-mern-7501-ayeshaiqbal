import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";
import { signupUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agree) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    try {
      const data = await signupUser({ name, email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const inputClass = `
    w-full
    h-[42px]
    rounded-lg
    border
    px-3
    outline-none
    text-sm
    transition-all
  `;

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
      {/* ================= NAVBAR ================= */}
      <header
        className={`h-[58px] border-b transition-colors duration-300 ${
          darkMode
            ? "bg-[#09070E] border-white/[0.08]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/signup" className="flex items-center gap-2.5">
            <BookOpen
              size={25}
              strokeWidth={2}
              className={`transition-colors duration-300 ${
                darkMode ? "text-white" : "text-[#111827]"
              }`}
            />

            <span
              className={`text-[20px] font-bold tracking-tight transition-colors duration-300 ${
                darkMode ? "text-white" : "text-[#111827]"
              }`}
            >
              Notes App
            </span>
          </Link>

          {/* Theme */}
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
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex justify-center px-4 py-5">
        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <div className="text-center mb-4">
            <h1
              className={`text-[22px] leading-tight font-bold tracking-tight ${
                darkMode ? "text-white" : "text-[#111827]"
              }`}
            >
              Sign Up
            </h1>

            <p
              className={`mt-1 text-[14px] font-medium ${
                darkMode ? "text-white" : "text-[#1F2937]"
              }`}
            >
              Create Your Account
            </p>

            <p
              className={`mt-1 text-[12px] ${
                darkMode ? "text-[#918599]" : "text-[#737B87]"
              }`}
            >
              Join Notes App and organize your thoughts
            </p>
          </div>

          {/* ================= CARD ================= */}
          <div
            className={`rounded-xl border p-4.5 transition-colors duration-300 ${
              darkMode
                ? "bg-[#0E0A14] border-[#251A2C] shadow-xl shadow-black/30"
                : "bg-white border-gray-200 shadow-lg shadow-gray-200/50"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Name */}
              <div>
                <label
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode ? "text-white" : "text-[#172033]"
                  }`}
                >
                  Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />

                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${fieldClass} pl-10`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode ? "text-white" : "text-[#172033]"
                  }`}
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${fieldClass} pl-10`}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode ? "text-white" : "text-[#172033]"
                  }`}
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${fieldClass} pl-10 pr-10`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-[#C8B9C9] hover:text-white"
                        : "text-[#7D8795] hover:text-[#7C3AED]"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode ? "text-white" : "text-[#172033]"
                  }`}
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${fieldClass} pl-10 pr-10`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-[#C8B9C9] hover:text-white"
                        : "text-[#7D8795] hover:text-[#7C3AED]"
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label
                className={`flex items-center gap-2 text-[11px] cursor-pointer pt-0.5 ${
                  darkMode ? "text-[#9E91A3]" : "text-[#69717D]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#C837AB]"
                  required
                />

                <span>
                  I agree to the{" "}
                  <span className="text-[#C837AB] font-medium">
                    Terms and Conditions
                  </span>
                </span>
              </label>

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-[11px] text-center">{error}</p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="w-full h-[42px] rounded-lg bg-gradient-to-r from-[#D21CFF] via-[#913CF5] to-[#477BFF] text-white text-[13px] font-semibold shadow-md shadow-purple-500/20 hover:brightness-110 active:scale-[0.99] transition-all"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Bottom Link */}
          <p
            className={`text-[12px] text-center mt-3 ${
              darkMode ? "text-[#8E8195]" : "text-[#707783]"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#C837AB] font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;