import axios from "axios";
import { API_URL } from "../configs/api";

const axiosInstance = axios.create({ baseURL: API_URL });
export default axiosInstance;
