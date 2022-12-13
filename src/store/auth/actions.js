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

export const setCurrentItem = (payload) => {
  return {
    type: Actions.SET_CURRENT_ITEM,
    payload,
  };
};
