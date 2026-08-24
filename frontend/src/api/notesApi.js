import axiosInstance from "./axiosInstance";

export const getNotes = async () => {
  const response = await axiosInstance.get("/notes");
  return response.data;
};

export const createNote = async (data) => {
  const response = await axiosInstance.post("/notes", data);
  return response.data;
};

export const updateNote = async (id, data) => {
  const response = await axiosInstance.put(`/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};