import axios from "axios";
import { requestHandler, successHandler, errorHandler } from "./interceptors";
import { getDomain } from "../utility/commonFunctions";

export const axiosInstance = axios.create({
  baseURL: `https://${getDomain()}.${process.env.REACT_APP_BASE_URL}`,
  withCredentials: true,
  crossDomain: true,
});

// Handle request process
axiosInstance.interceptors.request.use((request) => requestHandler(request));
// Handle response process
axiosInstance.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error),
);
