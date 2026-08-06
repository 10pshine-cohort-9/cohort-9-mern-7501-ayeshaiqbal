const { expect } = require("chai");
const sinon = require("sinon");

const { connection } = require("../config/db");

const {createNote,getNotesByUserId,updateNote,deleteNote} = require("../models/notesModel");

describe("Notes Model", () => {
  afterEach(() => {sinon.restore();});
  it("should call query to create note", () => {
    const queryStub = sinon.stub(connection, "query");
    const callback = () => {};
    createNote(1,"My Note","My Content",callback);
    expect(queryStub.calledOnce).to.equal(true);
  });

  it("should call query to get notes", () => {
    const queryStub = sinon.stub(connection, "query");
    const callback = () => {};
    getNotesByUserId(1,callback);
    expect(queryStub.calledOnce).to.equal(true);
  });

  it("should call query to update note", () => {
    const queryStub = sinon.stub(connection, "query");
     const callback = () => {};
     updateNote(1,1,"Updated Note","Updated Content",callback);
     expect(queryStub.calledOnce).to.equal(true);
  });

  it("should call query to delete note", () => {
    const queryStub = sinon.stub(connection, "query");
    const callback = () => {};
    deleteNote(1,1,callback);
    expect(queryStub.calledOnce).to.equal(true);
  });
});