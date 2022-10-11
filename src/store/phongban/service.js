import api from "../../api";
import * as API from "../../configs/api";

export const themPhongBanSvc = (payload) => {
  return api.post(API.PHONG_BAN, payload);
};

export const getDsPhongBanSvc = () => {
  return api.get(API.PHONG_BAN);
};

export const getDsUserPBSvc = ({ id }) => {
  return api.get(API.PHONG_BAN + "/" + id);
};

export const sapXepDsPhongBanSvc = (payload) => {
  return api.put(API.PHONG_BAN_SAP_XEP, payload);
};

export const xoaPhongBanSvc = ({ id }) => {
  return api.delete(API.PHONG_BAN + "/" + id);
};

export const suaPhongBanSvc = (payload) => {
  return api.put(API.PHONG_BAN, payload);
};
