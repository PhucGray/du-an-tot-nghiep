import api from "../../api";
import * as API from "../../configs/api";

export const themNguoiDungSvc = (payload) => {
  return api.post(API.NGUOI_DUNG_THEM, payload);
};

export const getDsNguoiDungSvc = () => {
  return api.get(API.NGUOI_DUNG);
};

export const getNguoiDungById = ({ id }) => {
  return api.get(API.NGUOI_DUNG + "/" + id);
};

export const xoaNguoiDungSvc = ({ id }) => {
  return api.delete(API.NGUOI_DUNG_XOA + "/" + id);
};

export const suaNguoiDungSvc = (payload) => {
  return api.put(API.NGUOI_DUNG, payload);
};

// export const themNguoiDung_QuyenSvc = (payload) => {
//   return api.post(API.NGUOI_DUNG__QUYEN, payload);
// };

// export const getNguoiDung_QuyenSvc = ({ id }) => {
//   return api.get(API.NGUOI_DUNG__QUYEN_IN + "/" + id);
// };
