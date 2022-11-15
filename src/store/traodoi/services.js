import api from "../../api";
import * as API from "../../configs/api";

export const getListTraoDoiSvc = ({id}) => {
  return api.get(API.TRAO_DOI + '/' + id)
}

export const getTraoDoiSvc = ({id}) => {
  return api.get(API.TRAO_DOI_CHI_TIET + '/' + id);
} 

export const themVanBanSvc = (payload) => {
  return api.post(API.TRAO_DOI, payload);
};

export const xoaVanBanSvc = ({id}) => {
  return api.delete(API.TRAO_DOI + '/' + id);
};