import api from "../../api";
import * as API from "../../configs/api";

export const themNguoiDung_PhongBanSvc = (payload) => {
  return api.post(API.NGUOI_DUNG__PHONG_BAN, payload);
};

export const getNguoiDung_PhongBanSvc = ({ id }) => {
  return api.get(API.NGUOI_DUNG__PHONG_BAN_IN + "/" + id);
};
