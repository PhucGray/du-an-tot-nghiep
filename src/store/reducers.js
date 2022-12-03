import { combineReducers } from "redux";
import PhongBanReducer from "../store/phongban/reducer";
import AuthReducer from "../store/auth/reducer";
import CommonReducer from '../store/common/reducer'

const appReducer = combineReducers({
  phongban: PhongBanReducer,
  auth: AuthReducer,
  common: CommonReducer
});

const rootReducers = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    // console.log("USER_LOGOUT");
    // localStorage.removeItem("persist:root");
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducers;
