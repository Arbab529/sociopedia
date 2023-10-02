import { createSlice } from "@reduxjs/toolkit";
import { user } from "../../assets/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
  suggestedFriends: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem("user");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    setSuggestedFriends(state, action) {
      state.suggestedFriends = action.payload;
    },
  },
});
export default userSlice.reducer;

export function LoginUser(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.login(user));
  };
}

export function Logout() {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
  };
}
export function UpdateProfile(value) {
  return (dispatch) => {
    dispatch(userSlice.actions.updateProfile(value));
  };
}

export function SetSuggestedFriends(value) {
  return (dispatch) => {
    dispatch(userSlice.actions.setSuggestedFriends(value));
  };
}
