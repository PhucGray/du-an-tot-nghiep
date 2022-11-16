import api from "../../api";
import * as API from "../../configs/api";

export const getListTraoDoiSvc = ({id}) => {
  return api.get(API.TRAO_DOI + '/' + id)
}

export const getTraoDoiSvc = ({id}) => {
  return api.get(API.TRAO_DOI_CHI_TIET + '/' + id);
} 

export const themTraoDoiSvc = (payload) => {
  return api.post(API.TRAO_DOI, payload);
};

export const xoaTraoDoiSvc = ({id}) => {
  return api.delete(API.TRAO_DOI + '/' + id);
};