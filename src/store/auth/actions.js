import * as Actions from "./constants";

export const setNguoiDung = (payload) => {
  return {
    type: Actions.SET_NGUOI_DUNG,
    payload,
  };
};

export const clearNguoiDung = () => {
  return {
    type: Actions.CLEAR_NGUOI_DUNG,
  };
};
