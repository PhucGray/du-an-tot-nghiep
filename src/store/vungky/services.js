import api from "../../api";
import * as API from "../../configs/api";

export const getVungKySvc = ({id}) => {
  return api.get(API.VUNG_KY + '/' + id);
};

export const checkVungKySvc = ({id}) => {
  return api.get(API.CHECK_VUNG_KY + '/' + id);
};

export const themVungKySvc = (payload) => {
  return api.post(API.VUNG_KY, payload)
}

export const getVungKyDeXuatSvc = ({id}) => {
  return api.get(API.VUNG_KY_DE_XUAT + '/' + id)
}