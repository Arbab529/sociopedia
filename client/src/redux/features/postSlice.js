import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
  },
});
export default postSlice.reducer;

// export function GetPosts() {
//   return (dispatch) => {
//     dispatch(postSlice.actions.getPosts());
//   };
// }
export function SetPosts(value) {
  return (dispatch) => {
    dispatch(postSlice.actions.setPosts(value));
  };
}
