import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {};

const Reducer = (state = initState, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

const persistConfig = {
  key: "nguoidung-phongban",
  blackList: [],
  storage,
};

export default persistReducer(persistConfig, Reducer);