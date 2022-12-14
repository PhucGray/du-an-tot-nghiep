import * as Actions from "./constants";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {
  nguoiDung: null,
  token: null,
  currentItem: null
};

const Reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case Actions.SET_NGUOI_DUNG:
      return { ...state, ...action?.payload };
    case Actions.CLEAR_NGUOI_DUNG:
      return initState;
    case Actions.SET_CURRENT_ITEM:
      console.log(action.payload)
      return {...state,currentItem: action.payload}
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
