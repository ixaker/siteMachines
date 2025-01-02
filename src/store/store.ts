import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../store/slice/dataSlice";
import adminReducer from "../store/slice/adminSlice";

const store = configureStore({
  reducer: {
    data: dataReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
