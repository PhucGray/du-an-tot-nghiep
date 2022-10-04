import api from "../../api";
import * as API from "../../configs/api";

export const themVaiTroSvc = (payload) => {
  return api.post(API.VAI_TRO, payload);
};

export const getDsVaiTroSvc = () => {
  return api.get(API.VAI_TRO);
};

export const xoaVaiTroSvc = ({ id }) => {
  return api.delete(API.VAI_TRO + "/" + id);
};

export const suaVaiTroSvc = (payload) => {
  return api.put(API.VAI_TRO, payload);
};
