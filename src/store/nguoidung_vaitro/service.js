import api from "../../api";
import * as API from "../../configs/api";

export const themNguoiDung_VaiTroSvc = (payload) => {
  return api.post(API.NGUOI_DUNG__VAI_TRO, payload);
};

export const getNguoiDung_VaiTroSvc = ({ id }) => {
  return api.get(API.NGUOI_DUNG__VAI_TRO_IN + "/" + id);
};
