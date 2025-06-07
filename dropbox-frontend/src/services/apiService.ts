import axios from "axios";
import { FilterParams } from "../types/FilterParams";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export function fetchFilteredFilesList(params: FilterParams) {
  const { page, size } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  }).toString();

  return axiosInstance.get(`/api/files?${queryParams}`);
}

export function uploadFile(formData: FormData) {
  return axiosInstance.post(`/api/files/upload`, formData, {});
}

const fetchFileContent = async (fileId: number) => {
  const response = await axiosInstance.get(`/api/files/${fileId}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    responseType: "blob",
  });
  return response.data;
};

export const apiService = {
  fetchFilteredFilesList,
  uploadFile,
  fetchFileContent,
};
