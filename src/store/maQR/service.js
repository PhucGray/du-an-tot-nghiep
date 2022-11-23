import api from "../../api";
import * as API from "../../configs/api";

export const ganMaQrSvc = (payload) => {
  return api.post(API.MA_QR, payload);
};

export const getFileChiTiet = ({id}) => {
  return api.get(API.MA_QR + '/' + id)
}

export const getListQrSvc = () => {
  return api.get(API.MA_QR)
}

export const editQr = (payload) => {
  return api.put(API.MA_QR, payload)
}