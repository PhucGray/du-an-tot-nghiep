import api from "../../api";
import * as API from "../../configs/api";

export const themQuyenSvc = (payload) => {
  return api.post(API.QUYEN, payload);
};

export const getDsQuyenSvc = () => {
  return api.get(API.QUYEN);
};

export const xoaQuyenSvc = ({ id }) => {
  return api.delete(API.QUYEN + "/" + id);
};

export const suaQuyenSvc = (payload) => {
  return api.put(API.QUYEN, payload);
};
