import api from "../../api";
import * as API from "../../configs/api";

export const dangNhap = (payload) => {
  // return axios.post(URL)
  return api.post(API.DANG_NHAP, payload);
};
