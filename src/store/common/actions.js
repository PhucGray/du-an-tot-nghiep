import * as Actions from "./constants";

export const setPingAction = (payload) => {
  return {
    type: Actions.SET_PING,
    payload,
  };
};
