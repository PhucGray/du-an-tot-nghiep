import axios from "axios";
import { API_URL, API_DOMAIN } from "../configs/api";

const axiosInstance = axios.create({ baseURL: API_URL });

// axiosInstance
//   .request({
//     baseURL: API_URL,
//     // You can add your headers here
//   })
//   .catch(function (error) {
//     if (!error.response) {
//       // network error
//       // console.error('network error');
//       // console.error(error);
//     } else {
//       // console.error('Error status');
//       // console.error(error);
//       // http status code
//       const code = error.response.status;
//       if (code === 500) {
//         console.log("Có lỗi từ hệ thống");
//       }
//       const response = error.response.data;
//     }
//   });

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.data) {
//       // useHookSlackError(error.response.data);
//       return Promise.reject(error.response.data);
//     }
//     // console.error('network error');
//     // console.error(error);
//     // useHookSlackError(error.response.data);
//     return Promise.reject(error.message);
//   },
// );
axiosInstance.interceptors.request.use(
  async (config) => {
    const savedNguoiDung = JSON.parse(localStorage.getItem("persist:auth") || '{}');

    if(savedNguoiDung?.token) {
      config.headers = {
        Authorization: `Bearer ${JSON.parse(savedNguoiDung?.token)}`,
        'Access-Control-Allow-Origin': API_DOMAIN,
        "Content-Type": "application/json",
      };
    }

    
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export default axiosInstance;
