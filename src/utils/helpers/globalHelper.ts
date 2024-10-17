import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export type AppDispatch = ThunkDispatch<any, any, AnyAction>;

const devices = {
  smallLaptop: "(max-width: 1024px)",
  laptop: "(max-width: 1440px)",
};

export default devices;
