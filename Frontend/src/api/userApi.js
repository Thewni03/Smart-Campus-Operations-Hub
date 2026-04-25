import axiosInstance from "./axiosInstance";

export const getStudents = () =>
  axiosInstance.get("/admin/users/students");

export const getTechnicianUsers = () =>
  axiosInstance.get("/admin/users/technicians");

export const deleteUser = (userId) =>
  axiosInstance.delete(`/admin/users/${userId}`);
