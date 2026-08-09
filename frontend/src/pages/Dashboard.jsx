import { useAuth } from "../context/useAuth";
import { useNavigate, Navigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#08060C] flex flex-col items-center justify-center gap-4">
      <h1 className="text-white text-2xl font-bold">
        Welcome, {user?.name || "User"}!
      </h1>
      <p className="text-[#918599] text-sm">Dashboard coming soon...</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-[#C837AB] text-white text-sm"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;