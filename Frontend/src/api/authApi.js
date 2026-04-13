import axiosInstance from "./axiosInstance";

export const loginUser = (payload) =>
  axiosInstance.post("/auth/login", payload);

export const signupUser = (payload) =>
  axiosInstance.post("/auth/signup", payload);
