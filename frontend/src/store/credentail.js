import { createSlice } from "@reduxjs/toolkit";

function getToken() {
  const obj = localStorage.getItem("token");
  if (!obj) {
    return;
  }
  return obj;
}

function checkToken() {
  if (getToken() === undefined) {
    return false;
  } else {
    return true;
  }
}

const initalCrential = {
  isLoggedIn: checkToken(),
};

const creadentialSlice = createSlice({
  name: "credentail",
  initialState: initalCrential,
  reducers: {
    setToken(state, action) {
      state.isLoggedIn = true;
    },
    removeToken(state, action) {
      state.isLoggedIn = false;
    },
  },
});

export const creadentialAction = creadentialSlice.actions;
export default creadentialSlice.reducer;
