import api from "../../api";
import * as API from "../../configs/api";

export const getListKSDX_ChuaDeXuat = ({ id }) => {
  return api.get(API.KSDX_CHUA_DE_XUAT + "/" + id);
};

export const getListKSDX_DaDuyet = ({ id }) => {
  return api.get(API.KSDX_DA_DUYET + "/" + id);
};

export const getListKSDX_ChoDuyet = ({ id }) => {
  return api.get(API.KSDX_CHO_DUYET + "/" + id);
};

export const getListKSDX_TuChoi = ({ id }) => {
  return api.get(API.KSDX_TU_CHOI + "/" + id);
};

export const themKSDX = (payload) => {
  return api.post(API.KSDX, payload);
};

export const suaKSDXSvc = (payload) => {
  return api.put(API.KSDX, payload);
};

export const xoaKSDX = ({ id }) => {
  return api.delete(API.KSDX + "/" + id);
};

export const getKSDXSvc = ({ id }) => {
  return api.get(API.KSDX + "/" + id);
};

export const getDsBuocDuyetSvc = ({ id }) => {
  return api.get(API.KSBD + "/" + id);
};

export const themBuocDuyetSvc = (payload) => {
  return api.post(API.KSBD, payload);
};

export const xoaBuocDuyetSvc = ({ id }) => {
  return api.delete(API.KSBD + "/" + id);
};
