import api from "../../api";
import * as API from "../../configs/api";

export const ganMaQrSvc = (payload) => {
  return api.post(API.MA_QR, payload);
};

export const getFileChiTiet = ({id}) => {
  return api.get(API.MA_QR + '/' + id)
}