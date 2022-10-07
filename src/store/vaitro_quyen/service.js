import api from "../../api";
import * as API from "../../configs/api";

export const themVaiTro_QuyenSvc = (payload) => {
  return api.post(API.VAI_TRO__QUYEN, payload);
};

export const getVaiTro_QuyenSvc = ({ id }) => {
  return api.get(API.VAI_TRO__QUYEN_IN + "/" + id);
};
