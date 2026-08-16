import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { resetPassword } from "../api/authApi";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        token,
        password,
      });

      setMessage(
        data.message || "Password reset successful."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-[42px] rounded-lg border px-3 outline-none text-sm transition-all";

  const fieldClass = darkMode
    ? `${inputClass} bg-[#2F1D32] border-[#593750] text-white placeholder:text-[#9E899F] focus:border-[#C837AB]`
    : `${inputClass} bg-[#F3F4F6] border-[#D9DDE3] text-[#111827] placeholder:text-[#8B93A0] focus:border-[#A855F7]`;

  const iconClass = darkMode
    ? "text-[#D2C4D3]"
    : "text-[#7D8795]";

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
          <Link
            to="/login"
            className="flex items-center gap-2.5"
          >
            <BookOpen
              size={25}
              strokeWidth={2}
              aria-hidden="true"
              className={
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }
            />

            <span
              className={`text-[20px] font-bold tracking-tight ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              Notes App
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              setDarkMode((prev) => !prev)
            }
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
          {/* Heading */}
          <div className="text-center mb-4">
            <h1
              className={`text-[22px] leading-tight font-bold tracking-tight ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              Reset Password
            </h1>

            <p
              className={`mt-1 text-[14px] font-medium ${
                darkMode
                  ? "text-white"
                  : "text-[#1F2937]"
              }`}
            >
              Create a new password
            </p>

            <p
              className={`mt-1 text-[12px] ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              Enter your new password below.
            </p>
          </div>
          <div
            className={`rounded-xl border p-4.5 transition-colors duration-300 ${
              darkMode
                ? "bg-[#0E0A14] border-[#251A2C] shadow-xl shadow-black/30"
                : "bg-white border-gray-200 shadow-lg shadow-gray-200/50"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              <div>
                <label
                  htmlFor="new-password"
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode
                      ? "text-white"
                      : "text-[#172033]"
                  }`}
                >
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    aria-hidden="true"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className={`${fieldClass} pl-10 pr-10`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-[#C8B9C9] hover:text-white"
                        : "text-[#7D8795] hover:text-[#7C3AED]"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff
                        size={16}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode
                      ? "text-white"
                      : "text-[#172033]"
                  }`}
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    aria-hidden="true"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className={`${fieldClass} pl-10 pr-10`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-[#C8B9C9] hover:text-white"
                        : "text-[#7D8795] hover:text-[#7C3AED]"
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        size={16}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
              {message && (
                <div
                  className={`rounded-lg px-3 py-2 text-[12px] ${
                    darkMode
                      ? "bg-green-500/10 text-green-300 border border-green-500/20"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-red-400 text-[12px]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] rounded-lg bg-gradient-to-r from-[#D21CFF] via-[#913CF5] to-[#477BFF] text-white text-[13px] font-semibold shadow-md shadow-purple-500/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </div>
          <div className="flex justify-center mt-4">
            <Link
              to="/login"
              className={`flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${
                darkMode
                  ? "text-[#C837AB] hover:text-[#E05BCA]"
                  : "text-[#C837AB] hover:text-[#A92B91]"
              }`}
            >
              <ArrowLeft
                size={14}
                aria-hidden="true"
              />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;