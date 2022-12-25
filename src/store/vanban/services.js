import api from "../../api";
import * as API from "../../configs/api";

export const getListVanBan = (token = null) => {
  if(!!token) return api.get(API.VAN_BAN, {headers: {"Authorization" : `Bearer ${token}`}})

  return api.get(API.VAN_BAN)
}

export const getVanBanSvc = ({id}) => {
  return api.get(API.VAN_BAN + '/' + id);
} 

export const themVanBanSvc = (payload) => {
  return api.post(API.VAN_BAN, payload);
};

export const suaVanBanSvc = (payload) => {
  return api.put(API.VAN_BAN, payload);
};

export const xoaVanBanSvc = ({id}) => {
  return api.delete(API.VAN_BAN + '/' + id);
};