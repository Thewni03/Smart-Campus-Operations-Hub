import axiosInstance from "./axiosInstance";

export const loginUser = (payload) =>
  axiosInstance.post("/auth/login", payload);

export const loginWithGoogle = (idToken) =>
  axiosInstance.post("/auth/google", { idToken });

export const signupUser = (payload) =>
  axiosInstance.post("/auth/signup", payload);
