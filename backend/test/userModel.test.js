const { expect } = require("chai");
const sinon = require("sinon");

const { connection } = require("../config/db");
const {
  findUserByEmail,
  createUser,
} = require("../models/userModel");

describe("User Model", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should call query to find user by email", () => {
    const queryStub = sinon.stub(connection, "query");

    const callback = () => {};

    findUserByEmail("ayesha@test.com", callback);

    expect(
      queryStub.calledWith(
        "SELECT * FROM users WHERE email = ?",
        ["ayesha@test.com"],
        callback,
      ),
    ).to.equal(true);
  });

  it("should call query to create user", () => {
    const queryStub = sinon.stub(connection, "query");

    const callback = () => {};

    createUser("Ayesha", "ayesha@test.com", "123456", callback);

    expect(queryStub.calledOnce).to.equal(true);

    const [query, values, receivedCallback] = queryStub.firstCall.args;

    expect(query.trim()).to.equal(
      `INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)`,
    );

    expect(values).to.deep.equal([
      "Ayesha",
      "ayesha@test.com",
      "123456",
    ]);

    expect(receivedCallback).to.equal(callback);
  });
});