import { combineReducers } from "redux";

const appReducer = combineReducers({});

const rootReducers = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    // console.log("USER_LOGOUT");
    // localStorage.removeItem("persist:root");
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducers;
