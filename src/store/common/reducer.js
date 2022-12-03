import * as Actions from "./constants";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initState = {
  ping: false,
  os: []
};

const Reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case Actions.SET_PING:
      const {ping, o} = action.payload

      if(!!o && state?.os?.every(i => i?.id !== o?.id)) {
        return { ...state, ping, os: [...(state.os || []), o] };
      }

      return {...state, ping}
    default:
      return state;
  }
};

const persistConfig = {
  key: "common",
  blackList: [],
  storage,
};

export default persistReducer(persistConfig, Reducer);
