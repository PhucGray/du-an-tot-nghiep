import { createSelector } from "reselect";

export const common = (state) => state.common;

export const pingSelector = createSelector(
  common,
  (data) => data?.ping || false,
);

export const osSelector = createSelector(
  common,
  data => data?.os || []
)