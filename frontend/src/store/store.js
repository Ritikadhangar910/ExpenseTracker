import { configureStore } from "@reduxjs/toolkit";
import credentilReducer from "./credentail";

const store = configureStore({
  reducer: { credential: credentilReducer },
});
export default store;
