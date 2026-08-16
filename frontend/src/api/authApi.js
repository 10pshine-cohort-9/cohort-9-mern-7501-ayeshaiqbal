import axiosInstance from "./axiosInstance";

export const signupUser = async (data) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};