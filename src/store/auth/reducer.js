import * as Actions from "./constants";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {
  nguoiDung: null,
  token: null,
};

const Reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case Actions.SET_NGUOI_DUNG:
      console.log({ ...state, ...action?.payload });
      return { ...state, ...action?.payload };
    case Actions.CLEAR_NGUOI_DUNG:
      return initState;
    default:
      return state;
  }
};

const persistConfig = {
  key: "auth",
  blackList: [],
  storage,
};

export default persistReducer(persistConfig, Reducer);
