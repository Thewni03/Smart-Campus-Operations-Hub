import axiosInstance from "./axiosInstance";

export const getResources = async () => {
  const response = await axiosInstance.get("/resources");
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await axiosInstance.post("/resources", resourceData);
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await axiosInstance.put(`/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axiosInstance.delete(`/resources/${id}`);
  return response.data;
};

// Upload resource image
export const uploadResourceImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post("/resources/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
