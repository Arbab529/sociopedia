import { combineReducers } from "@reduxjs/toolkit";
import postSlice from "./features/postSlice";
import themeSlice from "./features/themeSlice";
import userSlice from "./features/userSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
});

export { rootReducer };
