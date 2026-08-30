import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthContext } from "../context/AuthContext.jsx";

vi.mock("../pages/login", () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock("../pages/signup", () => ({
  default: () => <div>Signup Page</div>,
}));

vi.mock("../pages/ForgotPassword", () => ({
  default: () => <div>Forgot Password Page</div>,
}));

vi.mock("../pages/ResetPassword", () => ({
  default: () => <div>Reset Password Page</div>,
}));

vi.mock("../pages/Dashboard", () => ({
  default: () => <div>Dashboard Page</div>,
}));

describe("App routing", () => {
  it("redirects unauthenticated users to login", () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Login Page")).toBeTruthy();
  });

  it("shows dashboard for authenticated users", () => {
    render(
      <AuthContext.Provider value={{ user: { id: 1 } }}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Dashboard Page")).toBeTruthy();
  });

  it("shows signup page", () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter initialEntries={["/signup"]}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Signup Page")).toBeTruthy();
  });
});