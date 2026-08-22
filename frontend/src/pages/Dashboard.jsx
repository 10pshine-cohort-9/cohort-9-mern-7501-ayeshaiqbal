import { useCallback, useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
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
  CheckSquare,
  User,
  LogOut,
  Mail,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Minus,
  Plus as PlusIcon,
  ImagePlus,
  List,
  ListOrdered,
  Highlighter,
  Palette,
  Link as LinkIcon,
  Unlink,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Strikethrough,
  RemoveFormatting,
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  Download,
  Upload,
  FileText,
  Check,
  Eye,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/notesApi";
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: "420",

        parseHTML: (element) =>
          element.getAttribute("width") ||
          element.style.width?.replace("px", "") ||
          "420",

        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }

          return {
            width: attributes.width,
          };
        },
      },

      height: {
        default: null,

        parseHTML: (element) =>
          element.getAttribute("height") || null,

        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }

          return {
            height: attributes.height,
          };
        },
      },
    };
  },
});

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const [fontSize, setFontSize] = useState(16);

  const [selectedImage, setSelectedImage] = useState(false);
  const [imageWidth, setImageWidth] = useState(420);
  const getStoredNoteSettings = () => {
    try {
      return JSON.parse(
        localStorage.getItem("noteSettings") || "{}"
      );
    } catch {
      return {};
    }
  };

  const [noteSettings, setNoteSettings] = useState(
    getStoredNoteSettings
  );

  useEffect(() => {
    localStorage.setItem(
      "noteSettings",
      JSON.stringify(noteSettings)
    );
  }, [noteSettings]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [error]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

      TextStyle,

      FontSize,

      Color,

      Highlight.configure({
        multicolor: true,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),

      TaskList,

      TaskItem.configure({
        nested: true,
      }),
    ],

    content: "",

    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getHTML());

      const node = currentEditor.state.selection.node;

      if (node?.type?.name === "image") {
        setSelectedImage(true);

        const width =
          Number(node.attrs.width) || 420;

        setImageWidth(width);
      } else {
        setSelectedImage(false);
      }
    },

    onSelectionUpdate: ({ editor: currentEditor }) => {
      const node = currentEditor.state.selection.node;

      if (node?.type?.name === "image") {
        setSelectedImage(true);

        const width =
          Number(node.attrs.width) || 420;

        setImageWidth(width);
      } else {
        setSelectedImage(false);
      }
    },
  });

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

    const background = darkMode ? "#08060C" : "#F7F8FA";

    document.documentElement.style.backgroundColor = background;
    document.body.style.backgroundColor = background;
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";

    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
      document.body.style.minHeight = "";
    };
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

  const getNoteSetting = useCallback(
    (id) => {
      return noteSettings[id] || {};
    },
    [noteSettings]
  );

  const isPinned = useCallback(
    (id) => Boolean(getNoteSetting(id).isPinned),
    [getNoteSetting]
  );

  const isArchived = useCallback(
    (id) => Boolean(getNoteSetting(id).isArchived),
    [getNoteSetting]
  );

  const updateNoteSetting = useCallback(
    (id, changes) => {
      setNoteSettings((previous) => ({
        ...previous,

        [id]: {
          ...(previous[id] || {}),
          ...changes,
        },
      }));
    },
    []
  );

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPreview = (noteContent) => {
    if (!noteContent) {
      return "No additional content";
    }

    const plainText = noteContent
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!plainText) {
      return "No additional content";
    }

    return plainText.length > 130
      ? `${plainText.substring(0, 130)}...`
      : plainText;
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

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };
  const handleLogout = () => {
    logout();

    setShowProfile(false);

    navigate("/login", {
      replace: true,
    });
  };
  const openCreateEditor = () => {
    setEditingNote(null);

    setTitle("");
    setContent("");

    clearMessages();

    setFontSize(16);

    setSelectedImage(false);
    setImageWidth(420);

    setShowEditor(true);

    if (editor) {
      editor.commands.setContent("");

      editor
        .chain()
        .focus()
        .setFontSize("16px")
        .run();
    }
  };
  const openEditEditor = (note) => {
    setEditingNote(note);

    setTitle(note.title || "");
    setContent(note.content || "");

    clearMessages();

    setFontSize(16);

    setSelectedImage(false);
    setImageWidth(420);

    setShowEditor(true);

    setOpenMenu(null);

    if (editor) {
      editor.commands.setContent(
        note.content || ""
      );

      editor.commands.focus();
    }
  };
  const closeEditor = () => {
    if (saving) {
      return;
    }

    setShowEditor(false);

    setEditingNote(null);

    setTitle("");
    setContent("");

    setFontSize(16);

    setSelectedImage(false);
    setImageWidth(420);

    clearMessages();

    if (editor) {
      editor.commands.setContent("");
    }
  };
  const handleSaveNote = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    const cleanContent = editor
      ? editor.getHTML().trim()
      : content.trim();

    const plainText = editor
      ? editor.getText().trim()
      : content.trim();

    if (!cleanTitle || !plainText) {
      setError(
        "Title and content are required."
      );

      return;
    }

    try {
      setSaving(true);
      clearMessages();

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

        setSuccessMessage(
          "Note updated successfully."
        );

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

      setSuccessMessage(
        "Note created successfully."
      );
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
      clearMessages();

      await deleteNote(id);

      setNotes((previousNotes) =>
        previousNotes.filter(
          (note) => note.id !== id
        )
      );

      setNoteSettings((previous) => {
        const next = {
          ...previous,
        };

        delete next[id];

        return next;
      });

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

      setSuccessMessage(
        "Note deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the note. Please try again."
      );
    }
  };

  const handleTogglePin = (note) => {
    const nextValue = !isPinned(note.id);

    updateNoteSetting(note.id, {
      isPinned: nextValue,
    });

    setOpenMenu(null);

    setSuccessMessage(
      nextValue
        ? "Note pinned successfully."
        : "Note unpinned successfully."
    );
  };

  const handleToggleArchive = (note) => {
    const nextValue = !isArchived(note.id);

    updateNoteSetting(note.id, {
      isArchived: nextValue,
    });

    setOpenMenu(null);

    setSuccessMessage(
      nextValue
        ? "Note archived successfully."
        : "Note unarchived successfully."
    );
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
      clearMessages();

      const results = await Promise.allSettled(
        notesToDelete.map((id) =>
          deleteNote(id)
        )
      );

      const deletedIds = notesToDelete.filter(
        (id, index) =>
          results[index].status === "fulfilled"
      );

      const failedCount =
        results.length - deletedIds.length;

      setNotes((previousNotes) =>
        previousNotes.filter(
          (note) =>
            !deletedIds.includes(note.id)
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

      setSuccessMessage(
        `${deletedIds.length} note(s) deleted successfully.`
      );
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
        const noteTitle = (
          note.title || ""
        )
          .trim()
          .toLowerCase();

        const noteContent = (
          note.content || ""
        )
          .replace(/<[^>]*>/g, " ")
          .trim()
          .toLowerCase();

        return (
          noteTitle.includes(
            normalizedSearch
          ) ||
          noteContent.includes(
            normalizedSearch
          )
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
    let result = [...notes];

    if (activeTab === "pinned") {
      result = result.filter((note) =>
        isPinned(note.id)
      );
    }

    if (activeTab === "archive") {
      result = result.filter((note) =>
        isArchived(note.id)
      );
    }

    if (activeTab !== "archive") {
      result = result.filter(
        (note) => !isArchived(note.id)
      );
    }

    if (selectedSearchNote) {
      result = result.filter(
        (note) =>
          note.id === selectedSearchNote.id
      );
    } else if (normalizedSearch) {
      result = result.filter((note) => {
        const noteTitle = (
          note.title || ""
        ).toLowerCase();

        const noteContent = (
          note.content || ""
        )
          .replace(/<[^>]*>/g, " ")
          .toLowerCase();

        return (
          noteTitle.includes(
            normalizedSearch
          ) ||
          noteContent.includes(
            normalizedSearch
          )
        );
      });
    }

    return result.sort((a, b) => {
      const pinnedA = isPinned(a.id)
        ? 1
        : 0;

      const pinnedB = isPinned(b.id)
        ? 1
        : 0;

      if (pinnedA !== pinnedB) {
        return pinnedB - pinnedA;
      }

      return (
        new Date(
          b.updatedAt ||
            b.createdAt ||
            0
        ) -
        new Date(
          a.updatedAt ||
            a.createdAt ||
            0
        )
      );
    });
  }, [
    notes,
    activeTab,
    normalizedSearch,
    selectedSearchNote,
    isPinned,
    isArchived,
  ]);
  const decreaseFontSize = () => {
    if (!editor) {
      return;
    }

    const newSize = Math.max(
      12,
      fontSize - 1
    );

    setFontSize(newSize);

    editor
      .chain()
      .focus()
      .setFontSize(`${newSize}px`)
      .run();
  };

  const increaseFontSize = () => {
    if (!editor) {
      return;
    }

    const newSize = Math.min(
      32,
      fontSize + 1
    );

    setFontSize(newSize);

    editor
      .chain()
      .focus()
      .setFontSize(`${newSize}px`)
      .run();
  };
  const handleImageUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file || !editor) {
      return;
    }

    clearMessages();

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5MB."
      );

      event.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({
          src: reader.result,
          alt: file.name,
          width: "420",
        })
        .run();
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };
  const resizeSelectedImage = (width) => {
    if (!editor) {
      return;
    }

    const node =
      editor.state.selection.node;

    if (
      !node ||
      node.type.name !== "image"
    ) {
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        width: String(width),
        height: null,
      })
      .run();

    setImageWidth(width);

    setSelectedImage(true);
  };
  const deleteSelectedImage = () => {
    if (!editor) {
      return;
    }

    const node =
      editor.state.selection.node;

    if (
      !node ||
      node.type.name !== "image"
    ) {
      return;
    }

    editor
      .chain()
      .focus()
      .deleteSelection()
      .run();

    setSelectedImage(false);

    setImageWidth(420);
  };
  const handleTextColor = (event) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .setColor(event.target.value)
      .run();
  };
  const handleHighlightColor = (event) => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .toggleHighlight({
        color: event.target.value,
      })
      .run();
  };
  const handleSetLink = () => {
    if (!editor) {
      return;
    }

    const previousUrl =
      editor.getAttributes("link").href;

    const url = window.prompt(
      "Enter URL:",
      previousUrl || "https://"
    );

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url.trim(),
      })
      .run();
  };

  const handleUnsetLink = () => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .unsetLink()
      .run();
  };
  const downloadFile = (
    filename,
    data,
    type
  ) => {
    const blob = new Blob([data], {
      type,
    });

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download = filename;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  };
  const exportNote = (note, format) => {
    if (!note) {
      return;
    }

    const safeTitle =
      (note.title || "note")
        .replace(
          /[<>:"/\\|?*]+/g,
          "_"
        )
        .trim();

    if (format === "json") {
      downloadFile(
        `${safeTitle}.json`,
        JSON.stringify(
          note,
          null,
          2
        ),
        "application/json"
      );
    }

    if (format === "html") {
      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${note.title || "Note"}</title>
<style>
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  line-height: 1.7;
}
img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
</style>
</head>
<body>
<h1>${note.title || "Untitled Note"}</h1>
${note.content || ""}
</body>
</html>`;

      downloadFile(
        `${safeTitle}.html`,
        html,
        "text/html"
      );
    }

    if (format === "txt") {
      const text =
        `${note.title || "Untitled Note"}\n\n` +
        getPreview(note.content);

      downloadFile(
        `${safeTitle}.txt`,
        text,
        "text/plain"
      );
    }

    setOpenMenu(null);

    setSuccessMessage(
      `Note exported as ${format.toUpperCase()}.`
    );
  };

  const exportAllNotes = () => {
    downloadFile(
      "notes-backup.json",

      JSON.stringify(
        {
          exportedAt:
            new Date().toISOString(),

          notes,
        },
        null,
        2
      ),

      "application/json"
    );

    setSuccessMessage(
      "Notes backup exported successfully."
    );
  };
  const handleImportNotes = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

    if (
      file.type !==
        "application/json" &&
      !file.name.endsWith(".json")
    ) {
      setError(
        "Please select a valid JSON notes backup file."
      );

      event.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const parsed =
          JSON.parse(reader.result);

        const importedNotes =
          Array.isArray(parsed)
            ? parsed
            : parsed.notes;

        if (!Array.isArray(importedNotes)) {
          throw new Error(
            "Invalid notes backup."
          );
        }

        let importedCount = 0;

        for (const note of importedNotes) {
          if (
            !note.title ||
            !note.content
          ) {
            continue;
          }

          await createNote({
            title: note.title,
            content: note.content,
          });

          importedCount += 1;
        }

        const response =
          await getNotes();

        const receivedNotes =
          Array.isArray(response)
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

        if (importedCount > 0) {
          setSuccessMessage(
            `${importedCount} note(s) imported successfully.`
          );
        } else {
          setError(
            "No valid notes found in the file."
          );
        }
      } catch {
        setError(
          "Unable to import notes. Please select a valid JSON backup."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };
  const characterCount = editor
    ? editor.getText().length
    : 0;
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#08060C] text-white"
          : "bg-[#F7F8FA] text-[#111827]"
      }`}
    >
      <header
        className={`sticky top-0 z-40 h-[58px] border-b ${
          darkMode
            ? "bg-[#09070E] border-white/[0.08]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="h-full max-w-[1100px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen
              size={25}
              strokeWidth={2}
              aria-hidden="true"
              className={darkMode ? "text-white" : "text-[#111827]"}
            />
            <span
              className={`text-[20px] font-bold tracking-tight ${
                darkMode ? "text-white" : "text-[#111827]"
              }`}
            >
              Notes App
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportAllNotes}
              title="Export all notes"
              aria-label="Export all notes"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                darkMode
                  ? "border-white/10 bg-white/[0.04] text-[#D2C4D3] hover:bg-white/[0.08]"
                  : "border-gray-200 bg-white text-[#7C3AED] hover:bg-gray-50"
              }`}
            >
              <Download size={17} />
            </button>

            <label
              htmlFor="notes-import"
              title="Import notes"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer ${
                darkMode
                  ? "border-white/10 bg-white/[0.04] text-[#D2C4D3] hover:bg-white/[0.08]"
                  : "border-gray-200 bg-white text-[#7C3AED] hover:bg-gray-50"
              }`}
            >
              <Upload size={17} />
              <input
                id="notes-import"
                type="file"
                accept=".json,application/json"
                onChange={handleImportNotes}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle theme"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                darkMode
                  ? "border-white/10 bg-white/[0.04] text-yellow-300 hover:bg-white/[0.08]"
                  : "border-gray-200 bg-white text-[#7C3AED] hover:bg-gray-50"
              }`}
            >
              {darkMode ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => setShowProfile(true)}
              aria-label="Open profile"
              title="Profile"
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                darkMode
                  ? "bg-[#24152A] text-white border border-[#593750]"
                  : "bg-[#F3F4F6] text-[#374151] border border-gray-200"
              }`}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C837AB]" />

              <p
                className={`text-xs font-semibold uppercase tracking-[0.15em] ${
                  darkMode
                    ? "text-[#C837AB]"
                    : "text-[#8B5CF6]"
                }`}
              >
                Personal workspace
              </p>
            </div>

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
              className={`mt-2 max-w-xl text-sm leading-6 ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              Capture ideas, organize thoughts,
              and keep everything in one beautiful
              workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateEditor}
            className={`new-note-button ${
              darkMode
                ? "new-note-dark"
                : "new-note-light"
            }`}
          >
            <Plus size={18} />
            New Note
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1">
            <Search
              size={17}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                darkMode
                  ? "text-[#75677A]"
                  : "text-[#8B93A0]"
              }`}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                const value =
                  event.target.value;

                setSearch(value);

                setSelectedSearchNote(
                  null
                );

                setShowSuggestions(
                  Boolean(value.trim())
                );
              }}
              onFocus={() => {
                if (search.trim()) {
                  setShowSuggestions(
                    true
                  );
                }
              }}
              placeholder="Search your notes..."
              aria-label="Search your notes"
              className={`search-input ${
                darkMode
                  ? "search-input-dark"
                  : "search-input-light"
              }`}
            />

            {search && (
              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                aria-label="Clear search"
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center ${
                  darkMode
                    ? "text-[#918599] hover:bg-white/[0.06]"
                    : "text-[#737B87] hover:bg-gray-100"
                }`}
              >
                <X size={15} />
              </button>
            )}
            {showSuggestions &&
              normalizedSearch &&
              !selectedSearchNote && (
                <div
                  className={`absolute left-0 right-0 top-[52px] z-40 rounded-xl border shadow-2xl overflow-hidden ${
                    darkMode
                      ? "bg-[#17101C] border-[#35233D]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {suggestions.length >
                  0 ? (
                    suggestions.map(
                      (note) => (
                        <button
                          key={note.id}
                          type="button"
                          onClick={() =>
                            handleSuggestionClick(
                              note
                            )
                          }
                          className={`w-full px-4 py-3 text-left border-b last:border-b-0 ${
                            darkMode
                              ? "border-white/[0.05] hover:bg-white/[0.05]"
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                darkMode
                                  ? "bg-[#24152A] text-[#C837AB]"
                                  : "bg-purple-50 text-purple-600"
                              }`}
                            >
                              <FileText
                                size={15}
                              />
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
                                className={`text-xs mt-1 truncate ${
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
                          </div>
                        </button>
                      )
                    )
                  ) : (
                    <div
                      className={`px-4 py-5 text-sm text-center ${
                        darkMode
                          ? "text-[#918599]"
                          : "text-gray-500"
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
                (previous) =>
                  !previous
              );

              if (selectMode) {
                setSelectedNotes([]);
              }
            }}
            className={`secondary-button ${
              darkMode
                ? "secondary-button-dark"
                : "secondary-button-light"
            }`}
          >
            <CheckSquare size={17} />

            {selectMode
              ? "Cancel"
              : "Select"}
          </button>

          {selectMode &&
            selectedNotes.length >
              0 && (
              <button
                type="button"
                onClick={
                  handleDeleteSelected
                }
                className="danger-button"
              >
                <Trash2 size={17} />
                Delete (
                {selectedNotes.length})
              </button>
            )}
        </div>
        <div
          className={`flex items-center gap-1 border-b mb-7 overflow-x-auto ${
            darkMode
              ? "border-white/[0.08]"
              : "border-gray-200"
          }`}
        >
          {[
            [
              "all",
              "All Notes",
              FileText,
            ],
            ["pinned", "Pinned", Pin],
            [
              "archive",
              "Archive",
              Archive,
            ],
          ].map(([tab, label, Icon]) => {
            const count =
              tab === "pinned"
                ? notes.filter((note) =>
                    isPinned(note.id)
                  ).length
                : tab === "archive"
                ? notes.filter((note) =>
                    isArchived(note.id)
                  ).length
                : notes.filter(
                    (note) => !isArchived(note.id)
                  ).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`tab-button ${
                  activeTab === tab
                    ? darkMode
                      ? "tab-active-dark"
                      : "tab-active-light"
                    : darkMode
                    ? "tab-inactive-dark"
                    : "tab-inactive-light"
                }`}
              >
                <Icon size={15} />

                <span>{label}</span>

                <span
                  className={`tab-count ${
                    activeTab === tab
                      ? darkMode
                        ? "tab-count-active-dark"
                        : "tab-count-active-light"
                      : darkMode
                      ? "tab-count-dark"
                      : "tab-count-light"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        {error && (
          <div
            role="alert"
            className={`mb-5 rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-4 ${
              darkMode
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              aria-label="Close error message"
              className="shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-4 ${
              darkMode
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Check size={16} />

              <span>
                {successMessage}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage("")
              }
              aria-label="Close success message"
              className="shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className={`h-56 rounded-2xl animate-pulse ${
                    darkMode
                      ? "bg-[#120D17]"
                      : "bg-gray-200"
                  }`}
                />
              )
            )}
          </div>
        ) : filteredNotes.length ===
          0 ? (
          <div
            className={`empty-state ${
              darkMode
                ? "empty-state-dark"
                : "empty-state-light"
            }`}
          >
            <div
              className={`empty-icon ${
                darkMode
                  ? "empty-icon-dark"
                  : "empty-icon-light"
              }`}
            >
              <BookOpen size={27} />
            </div>

            <h2
              className={`text-xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-[#111827]"
              }`}
            >
              {activeTab === "pinned"
                ? "No pinned notes"
                : activeTab ===
                  "archive"
                ? "Archive is empty"
                : search
                ? "No notes found"
                : "Your notebook is empty"}
            </h2>

            <p
              className={`text-sm mt-2 max-w-md mx-auto leading-6 ${
                darkMode
                  ? "text-[#918599]"
                  : "text-[#737B87]"
              }`}
            >
              {activeTab === "pinned"
                ? "Pin important notes to access them quickly from your workspace."
                : activeTab ===
                  "archive"
                ? "Notes you archive will appear here."
                : search
                ? "Try a different keyword or clear your search."
                : "Create your first note and start capturing your ideas."}
            </p>

            {!search &&
              activeTab ===
                "all" && (
                <button
                  type="button"
                  onClick={
                    openCreateEditor
                  }
                  className={`mt-6 new-note-button ${
                    darkMode
                      ? "new-note-dark"
                      : "new-note-light"
                  }`}
                >
                  <Plus size={17} />
                  Create your first note
                </button>
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map(
              (note) => {
                const isSelected =
                  selectedNotes.includes(
                    note.id
                  );

                const pinned =
                  isPinned(note.id);

                const archived =
                  isArchived(note.id);

                return (
                  <article
                    key={note.id}
                    className={`note-card ${
                      isSelected
                        ? "note-card-selected"
                        : darkMode
                        ? "note-card-dark"
                        : "note-card-light"
                    }`}
                  >
                    {pinned && (
                      <div
                        className={`absolute top-4 right-12 w-7 h-7 rounded-lg flex items-center justify-center ${
                          darkMode
                            ? "bg-[#24152A] text-[#C837AB]"
                            : "bg-purple-50 text-purple-600"
                        }`}
                        title="Pinned"
                      >
                        <Pin
                          size={13}
                          fill="currentColor"
                        />
                      </div>
                    )}
                    {selectMode && (
                      <button
                        type="button"
                        onClick={() =>
                          toggleSelectNote(
                            note.id
                          )
                        }
                        aria-label={`Select ${
                          note.title ||
                          "note"
                        }`}
                        className={`absolute top-4 left-4 w-5 h-5 rounded-md border flex items-center justify-center ${
                          isSelected
                            ? "bg-[#C837AB] border-[#C837AB] text-white"
                            : darkMode
                            ? "border-[#593750] bg-transparent"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={13}
                          />
                        )}
                      </button>
                    )}
                    <div
                      className={`flex items-start justify-between ${
                        selectMode
                          ? "pl-8"
                          : ""
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

                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              darkMode
                                ? "bg-[#C837AB]"
                                : "bg-[#8B5CF6]"
                            }`}
                          />

                          <p
                            className={`text-[11px] ${
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
                      </div>

                      {!selectMode && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu ===
                                  note.id
                                  ? null
                                  : note.id
                              )
                            }
                            aria-label={`Actions for ${
                              note.title ||
                              "note"
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
                          {openMenu ===
                            note.id && (
                            <div
                              className={`absolute right-0 top-9 z-[100] w-48 rounded-xl border p-1 shadow-2xl ${
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
                                className="menu-button"
                              >
                                <Edit3
                                  size={14}
                                />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleTogglePin(
                                    note
                                  )
                                }
                                className="menu-button"
                              >
                                {pinned ? (
                                  <PinOff
                                    size={14}
                                  />
                                ) : (
                                  <Pin
                                    size={14}
                                  />
                                )}

                                {pinned
                                  ? "Unpin"
                                  : "Pin"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleArchive(
                                    note
                                  )
                                }
                                className="menu-button"
                              >
                                {archived ? (
                                  <ArchiveRestore
                                    size={14}
                                  />
                                ) : (
                                  <Archive
                                    size={14}
                                  />
                                )}

                                {archived
                                  ? "Unarchive"
                                  : "Archive"}
                              </button>

                              <div
                                className={`my-1 border-t ${
                                  darkMode
                                    ? "border-white/[0.07]"
                                    : "border-gray-100"
                                }`}
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  exportNote(
                                    note,
                                    "json"
                                  )
                                }
                                className="menu-button"
                              >
                                <Download
                                  size={14}
                                />
                                Export JSON
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  exportNote(
                                    note,
                                    "html"
                                  )
                                }
                                className="menu-button"
                              >
                                <Download
                                  size={14}
                                />
                                Export HTML
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  exportNote(
                                    note,
                                    "txt"
                                  )
                                }
                                className="menu-button"
                              >
                                <Download
                                  size={14}
                                />
                                Export TXT
                              </button>

                              <div
                                className={`my-1 border-t ${
                                  darkMode
                                    ? "border-white/[0.07]"
                                    : "border-gray-100"
                                }`}
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteNote(
                                    note.id
                                  )
                                }
                                className="delete-menu-button"
                              >
                                <Trash2
                                  size={14}
                                />
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
                      {getPreview(
                        note.content
                      )}
                    </div>

                    {/* FOOTER */}

                    <div
                      className={`mt-5 pt-4 border-t text-[11px] flex items-center justify-between ${
                        darkMode
                          ? "border-white/[0.06] text-[#75677A]"
                          : "border-gray-100 text-[#9AA1AC]"
                      }`}
                    >
                      <span>
                        {note.content
                          ?.includes(
                            "<img"
                          )
                          ? "Text + Image"
                          : "Text note"}
                      </span>

                      {archived && (
                        <span className="flex items-center gap-1">
                          <Archive
                            size={11}
                          />
                          Archived
                        </span>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </main>
      {showEditor && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditor();
            }
          }}
        >
          <div
            className={`w-full max-w-5xl max-h-[94vh] overflow-hidden rounded-2xl border shadow-2xl ${
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
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? "bg-[#24152A] text-[#C837AB]"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {editingNote ? (
                    <Edit3 size={17} />
                  ) : (
                    <FileText
                      size={17}
                    />
                  )}
                </div>

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
                        ? "text-[#75677A]"
                        : "text-[#8B93A0]"
                    }`}
                  >
                    Write, format and organize
                    your thoughts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                aria-label="Close editor"
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  darkMode
                    ? "text-[#918599] hover:bg-white/[0.06]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(94vh-76px)]">
              <form
                onSubmit={
                  handleSaveNote
                }
                className="p-4 sm:p-5"
              >
                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Give your note a title..."
                  aria-label="Note title"
                  disabled={saving}
                  autoFocus
                  className={`w-full h-12 px-4 rounded-xl border outline-none text-base font-semibold transition-colors ${
                    darkMode
                      ? "bg-[#17101C] border-[#35233D] text-white placeholder:text-[#75677A] focus:border-[#C837AB]"
                      : "bg-[#F8F9FB] border-gray-200 text-[#111827] placeholder:text-[#9AA1AC] focus:border-[#8B5CF6]"
                  }`}
                />
                {editor && (
                  <div
                    className={`mt-3 p-2 rounded-xl border flex flex-wrap items-center gap-1 ${
                      darkMode
                        ? "bg-[#17101C] border-[#35233D] text-[#E7DCE8]"
                        : "bg-[#F8F9FB] border-gray-200 text-[#374151]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleBold()
                          .run()
                      }
                      title="Bold"
                      aria-label="Bold"
                      className={`toolbar-button ${
                        editor.isActive(
                          "bold"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Bold size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleItalic()
                          .run()
                      }
                      title="Italic"
                      aria-label="Italic"
                      className={`toolbar-button ${
                        editor.isActive(
                          "italic"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Italic
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleUnderline()
                          .run()
                      }
                      title="Underline"
                      aria-label="Underline"
                      className={`toolbar-button ${
                        editor.isActive(
                          "underline"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <UnderlineIcon
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleStrike()
                          .run()
                      }
                      title="Strikethrough"
                      aria-label="Strikethrough"
                      className={`toolbar-button ${
                        editor.isActive(
                          "strike"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Strikethrough
                        size={16}
                      />
                    </button>

                    <div className="toolbar-divider" />
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({
                            level: 1,
                          })
                          .run()
                      }
                      title="Heading 1"
                      aria-label="Heading 1"
                      className={`toolbar-button ${
                        editor.isActive(
                          "heading",
                          {
                            level: 1,
                          }
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Heading1
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({
                            level: 2,
                          })
                          .run()
                      }
                      title="Heading 2"
                      aria-label="Heading 2"
                      className={`toolbar-button ${
                        editor.isActive(
                          "heading",
                          {
                            level: 2,
                          }
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Heading2
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({
                            level: 3,
                          })
                          .run()
                      }
                      title="Heading 3"
                      aria-label="Heading 3"
                      className={`toolbar-button ${
                        editor.isActive(
                          "heading",
                          {
                            level: 3,
                          }
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Heading3
                        size={16}
                      />
                    </button>

                    <div className="toolbar-divider" />
                    <button
                      type="button"
                      onClick={
                        decreaseFontSize
                      }
                      title="Decrease font size"
                      aria-label="Decrease font size"
                      className="toolbar-button"
                    >
                      <Minus size={16} />
                    </button>

                    <span
                      className={`font-size-label ${
                        darkMode
                          ? "text-[#CFC4D1]"
                          : "text-gray-600"
                      }`}
                    >
                      {fontSize}px
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseFontSize
                      }
                      title="Increase font size"
                      aria-label="Increase font size"
                      className="toolbar-button"
                    >
                      <PlusIcon
                        size={16}
                      />
                    </button>

                    <div className="toolbar-divider" />
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleBulletList()
                          .run()
                      }
                      title="Bullet list"
                      aria-label="Bullet list"
                      className={`toolbar-button ${
                        editor.isActive(
                          "bulletList"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <List size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleOrderedList()
                          .run()
                      }
                      title="Numbered list"
                      aria-label="Numbered list"
                      className={`toolbar-button ${
                        editor.isActive(
                          "orderedList"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <ListOrdered
                        size={18}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleTaskList()
                          .run()
                      }
                      title="Checklist"
                      aria-label="Checklist"
                      className={`toolbar-button ${
                        editor.isActive(
                          "taskList"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <CheckSquare
                        size={18}
                      />
                    </button>

                    <div className="toolbar-divider" />
                    <label
                      title="Text color"
                      className="color-picker-button"
                    >
                      <Palette size={17} />

                      <input
                        type="color"
                        value={darkMode ? "#FFFFFF" : "#111827"}
                        onChange={
                          handleTextColor
                        }
                      />
                    </label>

                    <label
                      title="Highlight color"
                      className="color-picker-button"
                    >
                      <Highlighter
                        size={17}
                      />

                      <input
                        type="color"
                        defaultValue="#FDE68A"
                        onChange={
                          handleHighlightColor
                        }
                      />
                    </label>

                    <div className="toolbar-divider" />
                    <button
                      type="button"
                      onClick={
                        handleSetLink
                      }
                      title="Add link"
                      aria-label="Add link"
                      className={`toolbar-button ${
                        editor.isActive(
                          "link"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <LinkIcon
                        size={17}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleUnsetLink
                      }
                      title="Remove link"
                      aria-label="Remove link"
                      className="toolbar-button"
                    >
                      <Unlink size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleBlockquote()
                          .run()
                      }
                      title="Quote"
                      aria-label="Quote"
                      className={`toolbar-button ${
                        editor.isActive(
                          "blockquote"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Quote size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleCode()
                          .run()
                      }
                      title="Inline code"
                      aria-label="Inline code"
                      className={`toolbar-button ${
                        editor.isActive(
                          "code"
                        )
                          ? "toolbar-active"
                          : ""
                      }`}
                    >
                      <Code size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .clearNodes()
                          .unsetAllMarks()
                          .run()
                      }
                      title="Clear formatting"
                      aria-label="Clear formatting"
                      className="toolbar-button"
                    >
                      <RemoveFormatting
                        size={17}
                      />
                    </button>

                    <div className="toolbar-divider" />
                    <label
                      htmlFor="note-image-upload"
                      title="Insert image"
                      className="toolbar-button cursor-pointer"
                    >
                      <ImagePlus
                        size={17}
                      />
                    </label>

                    <input
                      id="note-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={
                        handleImageUpload
                      }
                      className="hidden"
                    />
                    {selectedImage && (
                      <>
                        <div className="toolbar-divider" />

                        <div
                          className={`image-controls ${
                            darkMode
                              ? "image-controls-dark"
                              : "image-controls-light"
                          }`}
                        >
                          <span className="image-control-label">
                            Image
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              resizeSelectedImage(
                                180
                              )
                            }
                            title="Small image"
                            className={`image-size-button ${
                              imageWidth ===
                              180
                                ? "image-size-active"
                                : ""
                            }`}
                          >
                            S
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              resizeSelectedImage(
                                320
                              )
                            }
                            title="Medium image"
                            className={`image-size-button ${
                              imageWidth ===
                              320
                                ? "image-size-active"
                                : ""
                            }`}
                          >
                            M
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              resizeSelectedImage(
                                520
                              )
                            }
                            title="Large image"
                            className={`image-size-button ${
                              imageWidth ===
                              520
                                ? "image-size-active"
                                : ""
                            }`}
                          >
                            L
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              resizeSelectedImage(
                                700
                              )
                            }
                            title="Extra large image"
                            className={`image-size-button ${
                              imageWidth ===
                              700
                                ? "image-size-active"
                                : ""
                            }`}
                          >
                            XL
                          </button>

                          <button
                            type="button"
                            onClick={
                              deleteSelectedImage
                            }
                            title="Delete selected image"
                            aria-label="Delete selected image"
                            className="image-delete-button"
                          >
                            <Trash2
                              size={14}
                            />

                            <span>
                              Delete
                            </span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {selectedImage && (
                  <div
                    className={`mt-2 px-3 py-2 rounded-lg text-[11px] flex items-center gap-2 ${
                      darkMode
                        ? "bg-[#24152A] text-[#C9AFC6]"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    <Eye size={13} />

                    <span>
                      Image selected — choose
                      S, M, L or XL to resize,
                      or Delete to remove it.
                    </span>
                  </div>
                )}
                <div
                  className={`mt-3 rounded-xl border overflow-hidden ${
                    darkMode
                      ? "bg-[#17101C] border-[#35233D]"
                      : "bg-[#F8F9FB] border-gray-200"
                  }`}
                >
                  <EditorContent
                    editor={editor}
                    className={`tiptap-editor min-h-[300px] px-4 py-3 text-sm outline-none ${
                      darkMode
                        ? "text-[#F5EEF7]"
                        : "text-[#1F2937]"
                    }`}
                  />
                </div>
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 mt-3 text-xs ${
                    darkMode
                      ? "text-[#918599]"
                      : "text-[#737B87]"
                  }`}
                >
                  <span>
                    {characterCount}{" "}
                    {characterCount ===
                    1
                      ? "character"
                      : "characters"}
                  </span>

                  <span>
                    {editingNote
                      ? `Last edited ${formatDate(
                          editingNote.updatedAt ||
                            editingNote.createdAt
                        )}`
                      : "New note"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                  {editingNote ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePin(
                            editingNote
                          )
                        }
                        className={`editor-secondary-button ${
                          darkMode
                            ? "editor-secondary-dark"
                            : "editor-secondary-light"
                        }`}
                      >
                        {isPinned(
                          editingNote.id
                        ) ? (
                          <PinOff
                            size={15}
                          />
                        ) : (
                          <Pin
                            size={15}
                          />
                        )}

                        {isPinned(
                          editingNote.id
                        )
                          ? "Unpin"
                          : "Pin"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleArchive(
                            editingNote
                          )
                        }
                        className={`editor-secondary-button ${
                          darkMode
                            ? "editor-secondary-dark"
                            : "editor-secondary-light"
                        }`}
                      >
                        {isArchived(
                          editingNote.id
                        ) ? (
                          <ArchiveRestore
                            size={15}
                          />
                        ) : (
                          <Archive
                            size={15}
                          />
                        )}

                        {isArchived(
                          editingNote.id
                        )
                          ? "Unarchive"
                          : "Archive"}
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={
                        closeEditor
                      }
                      disabled={saving}
                      className={`editor-cancel-button ${
                        darkMode
                          ? "editor-cancel-dark"
                          : "editor-cancel-light"
                      }`}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className={`save-button ${
                        darkMode
                          ? "save-button-dark"
                          : "save-button-light"
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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowProfile(false);
            }
          }}
        >
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
              darkMode
                ? "bg-[#0E0A14] border-[#35233D]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={`text-lg font-semibold ${
                    darkMode
                      ? "text-white"
                      : "text-[#111827]"
                  }`}
                >
                  Your Profile
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Account information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowProfile(false)
                }
                aria-label="Close profile"
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  darkMode
                    ? "text-[#918599] hover:bg-white/[0.06]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                  darkMode
                    ? "bg-white text-[#111827]"
                    : "bg-[#111827] text-white"
                }`}
              >
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}
              </div>

              <h3
                className={`mt-4 font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-[#111827]"
                }`}
              >
                {user?.name ||
                  "User"}
              </h3>

              <p className="text-sm mt-1 text-gray-500">
                {user?.email ||
                  "No email available"}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <div
                className={`rounded-xl p-3.5 flex items-center gap-3 ${
                  darkMode
                    ? "bg-white/[0.04] text-[#D8CBD9]"
                    : "bg-gray-50 text-[#374151]"
                }`}
              >
                <User size={17} />

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Name
                  </p>

                  <p className="text-sm truncate mt-0.5">
                    {user?.name ||
                      "User"}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-xl p-3.5 flex items-center gap-3 ${
                  darkMode
                    ? "bg-white/[0.04] text-[#D8CBD9]"
                    : "bg-gray-50 text-[#374151]"
                }`}
              >
                <Mail size={17} />

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Email
                  </p>

                  <p className="text-sm truncate mt-0.5">
                    {user?.email ||
                      "No email available"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="w-full h-11 mt-6 rounded-xl bg-red-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      )}
      <style>{`
        .icon-button {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          transition: all 0.18s ease;
        }

        .icon-button-light {
          background: white;
          border-color: #E5E7EB;
          color: #4B5563;
        }

        .icon-button-light:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
          transform: translateY(-1px);
        }

        .icon-button-dark {
          background: rgba(255,255,255,0.035);
          border-color: rgba(255,255,255,0.09);
          color: #D9CDD9;
        }

        .icon-button-dark:hover {
          background: rgba(255,255,255,0.075);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }

        .theme-dark-button {
          color: #FDE68A;
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.18s ease;
        }

        .profile-avatar-light {
          background: #F1F3F5;
          color: #374151;
        }

        .profile-avatar-dark {
          background: #24152A;
          color: white;
          border: 1px solid rgba(200,55,171,0.18);
        }

        .profile-avatar:hover {
          transform: translateY(-1px);
        }

        .new-note-button {
          height: 44px;
          padding: 0 18px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .new-note-button:hover {
          transform: translateY(-1px);
        }

        .new-note-dark {
          background: white;
          color: #111827;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .new-note-light {
          background: #111827;
          color: white;
          box-shadow: 0 8px 25px rgba(17,24,39,0.12);
        }

        .secondary-button {
          height: 44px;
          padding: 0 15px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .secondary-button-light {
          background: white;
          border-color: #E5E7EB;
          color: #4B5563;
        }

        .secondary-button-light:hover {
          background: #F9FAFB;
        }

        .secondary-button-dark {
          background: #0E0A14;
          border-color: #251A2C;
          color: #D2C4D3;
        }

        .secondary-button-dark:hover {
          background: #17101C;
          border-color: #3A2840;
        }

        .danger-button {
          height: 44px;
          padding: 0 15px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #EF4444;
          color: white;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.18s ease;
        }

        .danger-button:hover {
          background: #DC2626;
      }
        .search-input {
          width: 100%;
          height: 44px;
          border-radius: 11px;
          border: 1px solid;
          padding-left: 42px;
          padding-right: 42px;
          font-size: 13px;
          outline: none;
          transition: all 0.18s ease;
        }

        .search-input-light {
          background: white;
          border-color: #E5E7EB;
          color: #111827;
        }

        .search-input-light::placeholder {
          color: #9AA1AC;
        }

        .search-input-light:focus {
          border-color: #8B5CF6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
        }

        .search-input-dark {
          background: #0E0A14;
          border-color: #251A2C;
          color: white;
        }

        .search-input-dark::placeholder {
          color: #75677A;
        }

        .search-input-dark:focus {
          border-color: #C837AB;
          box-shadow: 0 0 0 3px rgba(200,55,171,0.08);
        }
        .tab-button {
          height: 42px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-bottom: 2px solid transparent;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.18s ease;
        }

        .tab-count {
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          transition: all 0.18s ease;
        }

        .tab-count-active-light {
          background: #F3E8FF;
          color: #7C3AED;
        }

        .tab-count-active-dark {
          background: rgba(200,55,171,0.16);
          color: #F2A7E4;
        }

        .tab-count-light {
          background: #F3F4F6;
          color: #6B7280;
        }

        .tab-count-dark {
          background: rgba(255,255,255,0.06);
          color: #9F92A4;
        }

        .tab-active-light {
          color: #111827;
          border-bottom-color: #111827;
        }

        .tab-active-dark {
          color: white;
          border-bottom-color: #C837AB;
        }

        .tab-inactive-light {
          color: #8B93A0;
        }

        .tab-inactive-light:hover {
          color: #374151;
        }

        .tab-inactive-dark {
          color: #75677A;
        }

        .tab-inactive-dark:hover {
          color: #CFC4D1;
        }
        .note-card {
          position: relative;
          min-height: 218px;
          padding: 20px;
          border-radius: 17px;
          border: 1px solid;
          overflow: visible;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .note-card:hover {
          transform: translateY(-3px);
        }

        .note-card-light {
          background: white;
          border-color: #E7E9ED;
        }

        .note-card-light:hover {
          border-color: #D5D9DF;
          box-shadow: 0 14px 35px rgba(17,24,39,0.07);
        }

        .note-card-dark {
          background: #0E0A14;
          border-color: #251A2C;
        }

        .note-card-dark:hover {
          border-color: #4A3045;
          box-shadow: 0 14px 40px rgba(0,0,0,0.2);
        }

        .note-card-selected {
          border-color: #C837AB !important;
          box-shadow:
            0 0 0 3px rgba(200,55,171,0.12);
        }
        .empty-state {
          min-height: 330px;
          border: 1px solid;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-state-light {
          background: white;
          border-color: #E7E9ED;
        }

        .empty-state-dark {
          background: #0E0A14;
          border-color: #251A2C;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .empty-icon-light {
          background: #F5F3FF;
          color: #8B5CF6;
        }

        .empty-icon-dark {
          background: #24152A;
          color: #C837AB;
        }
        .menu-button {
          width: 100%;
          min-height: 34px;
          padding: 8px 10px;
          border-radius: 8px;
          text-align: left;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #374151;
          transition: background 0.15s ease;
        }

        .dark .menu-button {
          color: #F5EEF7;
        }

        .menu-button:hover {
          background: rgba(128,128,128,0.11);
        }

        .delete-menu-button {
          width: 100%;
          min-height: 34px;
          padding: 8px 10px;
          border-radius: 8px;
          text-align: left;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #EF4444;
          transition: background 0.15s ease;
        }

        .delete-menu-button:hover {
          background: rgba(239,68,68,0.1);
        }
        .toolbar-button {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          transition:
            background 0.15s ease,
            color 0.15s ease,
            transform 0.15s ease;
          flex-shrink: 0;
        }

        .toolbar-button:hover {
          background: rgba(128,128,128,0.14);
        }

        .toolbar-button:active {
          transform: scale(0.95);
        }

        .toolbar-active {
          background: #C837AB !important;
          color: white !important;
        }

        .toolbar-divider {
          width: 1px;
          height: 23px;
          margin: 0 4px;
          background: rgba(128,128,128,0.24);
          flex-shrink: 0;
        }

        .font-size-label {
          min-width: 42px;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
        }

        .color-picker-button {
          position: relative;
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }

        .color-picker-button:hover {
          background: rgba(128,128,128,0.14);
        }

        .color-picker-button input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .image-controls {
          display: flex;
          align-items: center;
          gap: 5px;
          padding-left: 2px;
          flex-wrap: wrap;
        }

        .image-control-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-right: 3px;
          opacity: 0.6;
        }

        .image-size-button {
          min-width: 29px;
          height: 28px;
          padding: 0 7px;
          border-radius: 7px;
          border: 1px solid rgba(128,128,128,0.25);
          background: transparent;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .image-size-button:hover {
          background: rgba(200,55,171,0.1);
          border-color: #C837AB;
          color: #C837AB;
        }

        .image-size-active {
          background: rgba(200,55,171,0.12);
          border-color: #C837AB;
          color: #C837AB;
        }

        .image-delete-button {
          height: 28px;
          padding: 0 9px;
          border-radius: 7px;
          border: 1px solid rgba(239,68,68,0.25);
          color: #EF4444;
          background: rgba(239,68,68,0.06);
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .image-delete-button:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.45);
        }
        .tiptap-editor .ProseMirror {
          color: #1F2937;
          min-height: 300px;
          outline: none;
          line-height: 1.75;
          overflow-wrap: anywhere;
        }

        .dark .tiptap-editor .ProseMirror {
          color: #F5EEF7;
        }

        .tiptap-editor .ProseMirror:focus {
          outline: none;
        }

        .tiptap-editor .ProseMirror p {
          margin: 0.45rem 0;
        }

        .tiptap-editor .ProseMirror h1 {
          font-size: 2rem;
          line-height: 1.2;
          font-weight: 750;
          margin: 1.2rem 0 0.65rem;
        }

        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          line-height: 1.3;
          font-weight: 750;
          margin: 1rem 0 0.55rem;
        }

        .tiptap-editor .ProseMirror h3 {
          font-size: 1.25rem;
          line-height: 1.4;
          font-weight: 700;
          margin: 0.9rem 0 0.45rem;
        }

        .tiptap-editor .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }

        .tiptap-editor .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }

        .tiptap-editor .ProseMirror li {
          margin: 0.25rem 0;
        }

        .tiptap-editor .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .tiptap-editor .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
        }

        .tiptap-editor .ProseMirror ul[data-type="taskList"] li > label {
          margin-top: 5px;
          flex-shrink: 0;
        }

        .tiptap-editor .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1;
        }

        .tiptap-editor .ProseMirror blockquote {
          border-left: 3px solid #C837AB;
          padding-left: 1rem;
          margin: 1rem 0;
          opacity: 0.88;
        }

        .tiptap-editor .ProseMirror code {
          background: rgba(128,128,128,0.15);
          padding: 2px 6px;
          border-radius: 5px;
          font-size: 0.9em;
        }

        .tiptap-editor .ProseMirror pre {
          background: #111827;
          color: #F9FAFB;
          padding: 14px 16px;
          border-radius: 10px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .tiptap-editor .ProseMirror pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
        .tiptap-editor .ProseMirror img {
          display: block;
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 14px 0;
          cursor: pointer;
          transition:
            box-shadow 0.18s ease,
            opacity 0.18s ease,
            transform 0.18s ease;
        }

        .tiptap-editor .ProseMirror img:hover {
          opacity: 0.96;
        }

        .tiptap-editor .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #C837AB;
          outline-offset: 4px;
          box-shadow:
            0 0 0 7px rgba(200,55,171,0.12);
        }

        .tiptap-editor .ProseMirror a {
          color: #C837AB;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .editor-secondary-button {
          height: 38px;
          padding: 0 12px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.15s ease;
        }

        .editor-secondary-dark {
          background: rgba(255,255,255,0.05);
          color: #D2C4D3;
        }

        .editor-secondary-dark:hover {
          background: rgba(255,255,255,0.09);
        }

        .editor-secondary-light {
          background: #F3F4F6;
          color: #4B5563;
        }

        .editor-secondary-light:hover {
          background: #E5E7EB;
        }

        .editor-cancel-button {
          height: 40px;
          padding: 0 14px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 600;
        }

        .editor-cancel-dark {
          color: #B9AEBB;
        }

        .editor-cancel-dark:hover {
          background: rgba(255,255,255,0.05);
        }

        .editor-cancel-light {
          color: #5F6875;
        }

        .editor-cancel-light:hover {
          background: #F3F4F6;
        }

        .save-button {
          height: 40px;
          padding: 0 17px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.18s ease;
        }

        .save-button:hover {
          transform: translateY(-1px);
        }

        .save-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .save-button-dark {
          background: white;
          color: #111827;
        }

        .save-button-light {
          background: #111827;
          color: white;
        }
        @media (max-width: 640px) {
          .toolbar-button {
            width: 34px;
            height: 34px;
          }

          .toolbar-divider {
            height: 20px;
            margin: 0 2px;
          }

          .image-controls {
            width: 100%;
            padding: 7px 0 2px;
            border-top: 1px solid rgba(128,128,128,0.18);
            margin-top: 4px;
          }

          .image-control-label {
            margin-right: auto;
          }

          .image-delete-button span {
            display: inline;
          }

          .tiptap-editor .ProseMirror h1 {
            font-size: 1.6rem;
          }

          .tiptap-editor .ProseMirror h2 {
            font-size: 1.35rem;
          }

          .tiptap-editor .ProseMirror h3 {
            font-size: 1.15rem;
          }
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(128,128,128,0.35) transparent;
        }

        *::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background: rgba(128,128,128,0.3);
          border-radius: 999px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: rgba(128,128,128,0.5);
        }
      `}</style>
    </div>
  );
}

export default Dashboard;