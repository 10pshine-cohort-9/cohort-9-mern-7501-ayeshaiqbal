import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Sun,
  Moon,
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  X,
  Save,
  Folder,
  CheckSquare,
  User,
  LogOut,
  Mail,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/notesApi";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSearchNote, setSelectedSearchNote] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getNotes();

        if (!isMounted) {
          return;
        }

        const receivedNotes = Array.isArray(response)
          ? response
          : response?.notes ||
            response?.data?.notes ||
            response?.data ||
            [];

        setNotes(
          Array.isArray(receivedNotes)
            ? receivedNotes
            : []
        );
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your notes. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate("/login", { replace: true });
  };

  const openCreateEditor = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setError("");
    setShowEditor(true);
  };

  const openEditEditor = (note) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setError("");
    setShowEditor(true);
    setOpenMenu(null);
  };

  const closeEditor = () => {
    if (saving) {
      return;
    }

    setShowEditor(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const extractNoteFromResponse = (response) => {
    if (!response) {
      return null;
    }

    if (response.note) {
      return response.note;
    }

    if (response.data?.note) {
      return response.data.note;
    }

    if (response.data?.id) {
      return response.data;
    }

    if (response.id) {
      return response;
    }

    return null;
  };

  const handleSaveNote = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    // Backend requires both fields.
    if (!cleanTitle || !cleanContent) {
      setError("Title and content are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingNote) {
        const response = await updateNote(
          editingNote.id,
          {
            title: cleanTitle,
            content: cleanContent,
          }
        );

        const apiNote =
          extractNoteFromResponse(response);

        const updatedNote = {
          ...editingNote,
          ...(apiNote || {}),
          id: editingNote.id,
          title: cleanTitle,
          content: cleanContent,
          updatedAt:
            apiNote?.updatedAt ||
            new Date().toISOString(),
        };

        setNotes((previousNotes) =>
          previousNotes.map((note) =>
            note.id === editingNote.id
              ? updatedNote
              : note
          )
        );

        if (
          selectedSearchNote?.id ===
          editingNote.id
        ) {
          setSelectedSearchNote(updatedNote);
        }

        closeEditor();
        return;
      }

      const response = await createNote({
        title: cleanTitle,
        content: cleanContent,
      });

      const apiNote =
        extractNoteFromResponse(response);

      const newNote = {
        ...(apiNote || {}),
        title: cleanTitle,
        content: cleanContent,
        createdAt:
          apiNote?.createdAt ||
          new Date().toISOString(),
        updatedAt:
          apiNote?.updatedAt ||
          new Date().toISOString(),
      };

      if (newNote.id) {
        setNotes((previousNotes) => [
          newNote,
          ...previousNotes,
        ]);
      } else {
        const refreshedResponse =
          await getNotes();

        const refreshedNotes =
          Array.isArray(refreshedResponse)
            ? refreshedResponse
            : refreshedResponse?.notes ||
              refreshedResponse?.data?.notes ||
              refreshedResponse?.data ||
              [];

        setNotes(
          Array.isArray(refreshedNotes)
            ? refreshedNotes
            : []
        );
      }

      closeEditor();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setError("");

      await deleteNote(id);

      setNotes((previousNotes) =>
        previousNotes.filter(
          (note) => note.id !== id
        )
      );

      setSelectedNotes((previousSelected) =>
        previousSelected.filter(
          (noteId) => noteId !== id
        )
      );

      if (selectedSearchNote?.id === id) {
        setSelectedSearchNote(null);
        setSearch("");
        setShowSuggestions(false);
      }

      setOpenMenu(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the note. Please try again."
      );
    }
  };

  const toggleSelectNote = (id) => {
    setSelectedNotes((previousSelected) =>
      previousSelected.includes(id)
        ? previousSelected.filter(
            (noteId) => noteId !== id
          )
        : [...previousSelected, id]
    );
  };
  
const handleDeleteSelected = async () => {
  if (selectedNotes.length === 0) {
    return;
  }

  const notesToDelete = [...selectedNotes];

  try {
    setError("");

    const results = await Promise.allSettled(
      notesToDelete.map((id) => deleteNote(id))
    );

    const deletedIds = notesToDelete.filter(
      (id, index) => results[index].status === "fulfilled"
    );

    const failedCount =
      results.length - deletedIds.length;

    setNotes((previousNotes) =>
      previousNotes.filter(
        (note) => !deletedIds.includes(note.id)
      )
    );

    setSelectedNotes((previousSelected) =>
      previousSelected.filter(
        (id) => !deletedIds.includes(id)
      )
    );

    if (failedCount > 0) {
      setError(
        `Unable to delete ${failedCount} of ${results.length} notes.`
      );
      return;
    }

    setSelectMode(false);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to delete selected notes."
    );
  }
};
 

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const suggestions = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }

    return notes
      .filter((note) => {
        const noteTitle = (note.title || "")
          .trim()
          .toLowerCase();

        const noteContent = (note.content || "")
          .trim()
          .toLowerCase();

        return (
          noteTitle.startsWith(normalizedSearch) ||
          noteContent.startsWith(normalizedSearch)
        );
      })
      .slice(0, 6);
  }, [notes, normalizedSearch]);

  const handleSuggestionClick = (note) => {
    setSearch(note.title || "");
    setSelectedSearchNote(note);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSelectedSearchNote(null);
    setShowSuggestions(false);
  };

  const filteredNotes = useMemo(() => {
    if (selectedSearchNote) {
      return notes.filter(
        (note) =>
          note.id === selectedSearchNote.id
      );
    }

    if (!normalizedSearch) {
      return notes;
    }

    return notes.filter((note) => {
      const noteTitle = (note.title || "")
        .toLowerCase();

      const noteContent = (note.content || "")
        .toLowerCase();

      return (
        noteTitle.includes(normalizedSearch) ||
        noteContent.includes(normalizedSearch)
      );
    });
  }, [
    notes,
    normalizedSearch,
    selectedSearchNote,
  ]);

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getPreview = (noteContent) => {
    if (!noteContent) {
      return "No additional content";
    }

    return noteContent.length > 130
      ? `${noteContent.substring(0, 130)}...`
      : noteContent;
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#08060C]"
          : "bg-[#F8F9FB]"
      }`}
    >
      <header
        className={`sticky top-0 z-30 h-14 border-b backdrop-blur-md ${
          darkMode
            ? "bg-[#09070E]/95 border-white/[0.08]"
            : "bg-white/95 border-gray-200"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen
              size={24}
              strokeWidth={2}
              aria-hidden="true"
              className={
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }
            />

            <span
              className={`text-xl font-bold tracking-tight ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              Notes App
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (previous) => !previous
                )
              }
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                darkMode
                  ? "border-white/[0.1] bg-white/[0.04] text-yellow-300 hover:bg-white/[0.08]"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {darkMode ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowProfile(true)
              }
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                darkMode
                  ? "bg-[#24152A] text-white hover:bg-[#321C3A]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Open profile"
            >
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-7">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">
          <div>
            <p
              className={`text-sm font-medium mb-1 ${
                darkMode
                  ? "text-[#C837AB]"
                  : "text-[#8B5CF6]"
              }`}
            >
              Your workspace
            </p>

            <h1
              className={`text-3xl md:text-4xl font-bold tracking-tight ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              Good to see you,{" "}
              {user?.name || "User"}
            </h1>

            <p
              className={`mt-2 text-sm ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              Capture ideas, organize thoughts,
              and keep everything in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateEditor}
            className={`h-11 px-5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-white text-[#111827] hover:bg-gray-100"
                : "bg-[#111827] text-white hover:bg-gray-800"
            }`}
          >
            <Plus size={18} />
            New Note
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={17}
              aria-hidden="true"
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#8B93A0]"
              }`}
            />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                const value = event.target.value;

                setSearch(value);
                setSelectedSearchNote(null);
                setShowSuggestions(
                  Boolean(value.trim())
                );
              }}
              onFocus={() => {
                if (search.trim()) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Search your notes..."
              aria-label="Search your notes"
              className={`w-full h-11 rounded-xl border pl-10 pr-10 text-sm outline-none ${
                darkMode
                  ? "bg-[#0E0A14] border-[#251A2C] text-white placeholder:text-[#75677A] focus:border-[#C837AB]"
                  : "bg-white border-gray-200 text-[#111827] placeholder:text-[#8B93A0] focus:border-gray-400"
              }`}
            />

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode
                    ? "text-[#918599] hover:text-white"
                    : "text-[#8B93A0] hover:text-[#111827]"
                }`}
              >
                <X size={16} />
              </button>
            )}

            {showSuggestions &&
              normalizedSearch &&
              !selectedSearchNote && (
                <div
                  className={`absolute left-0 right-0 top-12 z-40 rounded-xl border shadow-2xl overflow-hidden ${
                    darkMode
                      ? "bg-[#17101C] border-[#35233D]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {suggestions.length > 0 ? (
                    <div className="py-1">
                      {suggestions.map(
                        (note) => (
                          <button
                            key={note.id}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(
                                note
                              )
                            }
                            className={`w-full px-4 py-3 text-left flex items-start gap-3 transition-colors ${
                              darkMode
                                ? "hover:bg-white/[0.05]"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                darkMode
                                  ? "bg-[#24152A] text-[#C837AB]"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <BookOpen size={15} />
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`text-sm font-semibold truncate ${
                                  darkMode
                                    ? "text-white"
                                    : "text-[#111827]"
                                }`}
                              >
                                {note.title ||
                                  "Untitled Note"}
                              </p>

                              <p
                                className={`text-xs mt-0.5 truncate ${
                                  darkMode
                                    ? "text-[#918599]"
                                    : "text-[#8B93A0]"
                                }`}
                              >
                                {getPreview(
                                  note.content
                                )}
                              </p>
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-4 text-sm ${
                        darkMode
                          ? "text-[#918599]"
                          : "text-[#737B87]"
                      }`}
                    >
                      No matching notes found.
                    </div>
                  )}
                </div>
              )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectMode(
                (previous) => !previous
              );

              if (selectMode) {
                setSelectedNotes([]);
              }
            }}
            className={`h-11 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-[#0E0A14] border-[#251A2C] text-[#D2C4D3] hover:border-[#593750]"
                : "bg-white border-gray-200 text-[#4B5563] hover:border-gray-300"
            }`}
          >
            <CheckSquare size={17} />
            {selectMode
              ? "Cancel Select"
              : "Select"}
          </button>

          {selectMode &&
            selectedNotes.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="h-11 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={17} />
                Delete ({selectedNotes.length})
              </button>
            )}
        </div>

        <div
          className={`flex items-center gap-1 border-b mb-6 ${
            darkMode
              ? "border-white/[0.08]"
              : "border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "all"
                ? darkMode
                  ? "text-white border-white"
                  : "text-[#111827] border-[#111827]"
                : darkMode
                ? "text-[#8E8195] border-transparent"
                : "text-[#737B87] border-transparent"
            }`}
          >
            All Notes
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("folders")
            }
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "folders"
                ? darkMode
                  ? "text-white border-white"
                  : "text-[#111827] border-[#111827]"
                : darkMode
                ? "text-[#8E8195] border-transparent"
                : "text-[#737B87] border-transparent"
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder size={15} />
              Folders
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center justify-between">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {activeTab === "folders" ? (
          <div
            className={`rounded-2xl border p-10 text-center ${
              darkMode
                ? "bg-[#0E0A14] border-[#251A2C]"
                : "bg-white border-gray-200"
            }`}
          >
            <Folder
              size={32}
              className={`mx-auto mb-3 ${
                darkMode
                  ? "text-[#C837AB]"
                  : "text-gray-700"
              }`}
            />

            <h2
              className={`font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              Folders coming soon
            </h2>

            <p
              className={`text-sm mt-1 ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              Folder organization will be added
              in a future update.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-48 rounded-2xl animate-pulse ${
                  darkMode
                    ? "bg-[#120D17]"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div
            className={`rounded-2xl border p-12 text-center ${
              darkMode
                ? "bg-[#0E0A14] border-[#251A2C]"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                darkMode
                  ? "bg-[#24152A]"
                  : "bg-gray-100"
              }`}
            >
              <BookOpen
                size={25}
                className={
                  darkMode
                    ? "text-[#C837AB]"
                    : "text-gray-700"
                }
              />
            </div>

            <h2
              className={`text-lg font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              {search
                ? "No notes found"
                : "Your notebook is empty"}
            </h2>

            <p
              className={`text-sm mt-1 mb-5 ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              {search
                ? "Try a different search term."
                : "Create your first note and start capturing your ideas."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openCreateEditor}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  darkMode
                    ? "bg-white text-[#111827] hover:bg-gray-100"
                    : "bg-[#111827] text-white hover:bg-gray-800"
                }`}
              >
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => {
              const isSelected =
                selectedNotes.includes(note.id);

              return (
                <article
                  key={note.id}
                  className={`group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${
                    isSelected
                      ? "border-[#C837AB] ring-2 ring-[#C837AB]/20"
                      : darkMode
                      ? "bg-[#0E0A14] border-[#251A2C] hover:border-[#593750]"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
                  }`}
                >
                  {selectMode && (
                    <button
                      type="button"
                      onClick={() =>
                        toggleSelectNote(
                          note.id
                        )
                      }
                      aria-label={`Select ${
                        note.title || "note"
                      }`}
                      className={`absolute top-4 left-4 w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? "bg-[#C837AB] border-[#C837AB] text-white"
                          : darkMode
                          ? "border-[#593750]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckSquare size={13} />
                      )}
                    </button>
                  )}

                  <div
                    className={`flex items-start justify-between ${
                      selectMode ? "pl-8" : ""
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <h3
                        className={`font-semibold text-base truncate ${
                          darkMode
                            ? "text-white"
                            : "text-[#111827]"
                        }`}
                      >
                        {note.title ||
                          "Untitled Note"}
                      </h3>

                      <p
                        className={`text-[11px] mt-1 ${
                          darkMode
                            ? "text-[#75677A]"
                            : "text-[#9AA1AC]"
                        }`}
                      >
                        {formatDate(
                          note.updatedAt ||
                            note.createdAt
                        )}
                      </p>
                    </div>

                    {!selectMode && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === note.id
                                ? null
                                : note.id
                            )
                          }
                          aria-label={`Actions for ${
                            note.title || "note"
                          }`}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode
                              ? "text-[#918599] hover:bg-white/[0.05]"
                              : "text-[#737B87] hover:bg-gray-100"
                          }`}
                        >
                          <MoreVertical
                            size={17}
                          />
                        </button>

                        {openMenu === note.id && (
                          <div
                            className={`absolute right-0 top-9 z-20 w-32 rounded-xl border p-1 shadow-xl ${
                              darkMode
                                ? "bg-[#17101C] border-[#35233D]"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEditEditor(
                                  note
                                )
                              }
                              className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center gap-2 ${
                                darkMode
                                  ? "text-white hover:bg-white/[0.05]"
                                  : "text-[#374151] hover:bg-gray-100"
                              }`}
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteNote(
                                  note.id
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg text-left text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`mt-5 text-sm leading-6 min-h-[72px] ${
                      darkMode
                        ? "text-[#B9AEBB]"
                        : "text-[#5F6875]"
                    }`}
                  >
                    {getPreview(note.content)}
                  </div>

                  <div
                    className={`mt-5 pt-4 border-t text-[11px] ${
                      darkMode
                        ? "border-white/[0.06] text-[#75677A]"
                        : "border-gray-100 text-[#9AA1AC]"
                    }`}
                  >
                    Notes App
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl ${
              darkMode
                ? "bg-[#0E0A14] border-[#35233D]"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`px-5 py-4 border-b flex items-center justify-between ${
                darkMode
                  ? "border-white/[0.08]"
                  : "border-gray-200"
              }`}
            >
              <div>
                <h2
                  className={`text-lg font-semibold ${
                    darkMode
                      ? "text-white"
                      : "text-[#111827]"
                  }`}
                >
                  {editingNote
                    ? "Edit Note"
                    : "Create Note"}
                </h2>

                <p
                  className={`text-xs mt-0.5 ${
                    darkMode
                      ? "text-[#918599]"
                      : "text-[#737B87]"
                  }`}
                >
                  Keep your thoughts organized.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                aria-label="Close note editor"
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  darkMode
                    ? "text-[#918599] hover:bg-white/[0.05]"
                    : "text-[#737B87] hover:bg-gray-100"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSaveNote}
              className="p-5"
            >
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Note title"
                aria-label="Note title"
                disabled={saving}
                className={`w-full h-12 px-4 rounded-xl border outline-none text-base font-semibold ${
                  darkMode
                    ? "bg-[#17101C] border-[#35233D] text-white placeholder:text-[#75677A] focus:border-[#C837AB]"
                    : "bg-[#F8F9FB] border-gray-200 text-[#111827] placeholder:text-[#9AA1AC] focus:border-gray-400"
                }`}
              />

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Start writing your note..."
                rows={9}
                aria-label="Note content"
                disabled={saving}
                className={`mt-3 w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none ${
                  darkMode
                    ? "bg-[#17101C] border-[#35233D] text-white placeholder:text-[#75677A] focus:border-[#C837AB]"
                    : "bg-[#F8F9FB] border-gray-200 text-[#111827] placeholder:text-[#9AA1AC] focus:border-gray-400"
                }`}
              />

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={saving}
                  className={`px-4 h-10 rounded-lg text-sm font-medium ${
                    darkMode
                      ? "text-[#B9AEBB] hover:bg-white/[0.05]"
                      : "text-[#5F6875] hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={`px-5 h-10 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    darkMode
                      ? "bg-white text-[#111827] hover:bg-gray-100"
                      : "bg-[#111827] text-white hover:bg-gray-800"
                  }`}
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : editingNote
                    ? "Save Changes"
                    : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
              darkMode
                ? "bg-[#0E0A14] border-[#35233D]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-[#111827]"
                }`}
              >
                Your Profile
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowProfile(false)
                }
                aria-label="Close profile"
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode
                    ? "text-[#918599] hover:bg-white/[0.05]"
                    : "text-[#737B87] hover:bg-gray-100"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                  darkMode
                    ? "bg-white text-[#111827]"
                    : "bg-[#111827] text-white"
                }`}
              >
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <h3
                className={`mt-4 font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-[#111827]"
                }`}
              >
                {user?.name || "User"}
              </h3>

              <p
                className={`text-sm mt-1 ${
                  darkMode
                    ? "text-[#918599]"
                    : "text-[#737B87]"
                }`}
              >
                {user?.email ||
                  "No email available"}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <div
                className={`rounded-xl p-3 flex items-center gap-3 ${
                  darkMode
                    ? "bg-white/[0.04]"
                    : "bg-[#F8F9FB]"
                }`}
              >
                <User
                  size={17}
                  className={
                    darkMode
                      ? "text-[#C837AB]"
                      : "text-gray-700"
                  }
                />

                <span
                  className={`text-sm ${
                    darkMode
                      ? "text-[#CFC4D1]"
                      : "text-[#4B5563]"
                  }`}
                >
                  {user?.name || "User"}
                </span>
              </div>

              <div
                className={`rounded-xl p-3 flex items-center gap-3 ${
                  darkMode
                    ? "bg-white/[0.04]"
                    : "bg-[#F8F9FB]"
                }`}
              >
                <Mail
                  size={17}
                  className={
                    darkMode
                      ? "text-[#C837AB]"
                      : "text-gray-700"
                  }
                />

                <span
                  className={`text-sm truncate ${
                    darkMode
                      ? "text-[#CFC4D1]"
                      : "text-[#4B5563]"
                  }`}
                >
                  {user?.email ||
                    "No email available"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-11 mt-6 rounded-xl bg-red-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;