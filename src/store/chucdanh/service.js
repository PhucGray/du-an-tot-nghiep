import api from "../../api";
import * as API from "../../configs/api";

export const themChucDanhSvc = (payload) => {
  return api.post(API.CHUC_DANH, payload);
};

export const getDsChucDanhSvc = () => {
  return api.get(API.CHUC_DANH);
};

export const sapXepDsChucDanhSvc = (payload) => {
  return api.put(API.CHUC_DANH_SAP_XEP, payload);
};

export const xoaChucDanhSvc = ({ id }) => {
  return api.delete(API.CHUC_DANH + "/" + id);
};

export const suaChucDanhSvc = (payload) => {
  return api.put(API.CHUC_DANH, payload);
};
