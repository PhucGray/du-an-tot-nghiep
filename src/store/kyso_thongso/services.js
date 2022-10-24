import api from "../../api";
import * as API from "../../configs/api";

export const getListNguoiDungDuyetSvc = () => {
  return api.get(API.KS_TS_NGUOI_DUNG_DUYET);
};

export const themNguoiDungDuyetSvc = (payload) => {
  return api.post(API.KS_TS, payload);
};

export const suaNguoiDungDuyetSvc = (payload) => {
  return api.put(API.KS_TS, payload);
};

export const suaPasscodeSvc = (payload) => {
  return api.put(API.KS_TS_DOI_PASSCODE, payload);
};

export const suaCauHinhPfxSvc = (payload) => {
  return api.put(API.KS_TS_CAU_HINH_PFX, payload);
};

export const getListThongSoKiSo = () => {
  return api.get(API.KS_TS);
};

export const xoaThongSoNguoiDung = ({ id }) => {
  return api.delete(API.KS_TS + "/" + id);
};
