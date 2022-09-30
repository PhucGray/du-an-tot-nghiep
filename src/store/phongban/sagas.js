import { put, call, takeEvery } from "redux-saga/effects";
import * as Actions from "./constants";

function* getDsPhongBanMethod() {
  try {
  } catch (error) {
    console.log("getDsPhongBanMethod: " + error);
  }
}

export default function* authSaga() {
  yield takeEvery(Actions.GET_DS_PHONG_BAN, getDsPhongBanMethod);
}
