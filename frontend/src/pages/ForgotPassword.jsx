import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Sun, Moon, BookOpen } from "lucide-react";
import { forgotPassword } from "../api/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
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
    setLoading(true);

    try {
      const data = await forgotPassword({ email });

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again."
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
          <Link to="/login" className="flex items-center gap-2.5">
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
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              Forgot Password?
            </h1>

            <p
              className={`mt-1 text-[14px] font-medium ${
                darkMode
                  ? "text-white"
                  : "text-[#1F2937]"
              }`}
            >
              Reset your password
            </p>

            <p
              className={`mt-1 text-[12px] ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              Enter your email address and we'll help you reset your password.
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
                  htmlFor="forgot-email"
                  className={`block text-[12px] font-medium mb-1.5 ${
                    darkMode
                      ? "text-white"
                      : "text-[#172033]"
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
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${fieldClass} pl-10`}
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
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
                <div
                  role="alert"
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-red-400 text-[12px]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] rounded-lg bg-gradient-to-r from-[#D21CFF] via-[#913CF5] to-[#477BFF] text-white text-[13px] font-semibold shadow-md shadow-purple-500/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
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
              <ArrowLeft size={14} aria-hidden="true" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;