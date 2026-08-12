const { expect } = require("chai");
const sinon = require("sinon");

const {
  addNote,
  getNotes,
  updateUserNote,
  deleteUserNote,
} = require("../controllers/notesController");

describe("Notes Controller", () => {
  it("should return 400 if title or content is missing", () => {
    
    const req = {
      body: {
        title: "My First Note",
      },
      user: {
        id: 1,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    addNote(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(
      res.json.calledWith({
        message: "Title and content are required",
      }),
    ).to.equal(true);
  });
  it("should return 400 if update note fields are missing", () => {
  const req = {
    body: {},
    params: {
      id: 1,
    },
    user: {
      id: 1,
    },
  };

  const res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  };

  const next = sinon.stub();

  updateUserNote(req, res, next);

  expect(res.status.calledWith(400)).to.equal(true);
  expect(
    res.json.calledWith({
      message: "Title and content are required",
    }),
  ).to.equal(true);
});

});