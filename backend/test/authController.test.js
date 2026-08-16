const { expect } = require("chai");
const sinon = require("sinon");

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

describe("Auth Controller", () => {
  it("should return 400 if required fields are missing", () => {
    const req = {
      body: {
        email: "ayesha@test.com",
        password: "123456",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    signup(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "All fields are required",
      }),
    ).to.equal(true);
  });

  it("should return 400 if email or password is missing", () => {
    const req = {
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    login(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "Email and password are required",
      }),
    ).to.equal(true);
  });

  it("should logout successfully", () => {
    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    logout(req, res);

    expect(res.status.calledWith(200)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "Logout successful",
      }),
    ).to.equal(true);
  });

  it("should return 400 if forgot password email is missing", () => {
    const req = {
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    forgotPassword(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "Email is required",
      }),
    ).to.equal(true);
  });

  it("should return 400 if reset password token or password is missing", async () => {
    const req = {
      body: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    await resetPassword(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "Token and password are required",
      }),
    ).to.equal(true);
  });

  it("should return 400 if reset password is less than 6 characters", async () => {
    const req = {
      body: {
        token: "test-token",
        password: "123",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    await resetPassword(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "Password must be at least 6 characters",
      }),
    ).to.equal(true);
  });
});