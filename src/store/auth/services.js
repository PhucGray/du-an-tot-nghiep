import api from "../../api";
import * as API from "../../configs/api";

export const dangNhap = (payload) => {
  return api.post(API.DANG_NHAP, payload);
};

export const doiMatKhau = (payload) => {
  return api.put(API.NGUOI_DUNG_DOI_MK, payload);
};
