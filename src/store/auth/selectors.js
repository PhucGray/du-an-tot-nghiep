import { createSelector } from "reselect";

export const auth = (state) => state.auth;

export const nguoiDungSelector = createSelector(
  auth,
  (data) => data?.nguoiDung || null,
);

export const tokenSelector = createSelector(
  auth,
  (data) => data?.token || null,
);
