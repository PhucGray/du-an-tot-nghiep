import api from "../../api";
import * as API from "../../configs/api";

export const logThongSoSvc = ({ id }) => {
  return api.get(API.LOG_THONG_SO + "/" + id);
};

export const logDeXuatSvc = ({ id }) => {
  return api.get(API.LOG_DE_XUAT + "/" + id);
};