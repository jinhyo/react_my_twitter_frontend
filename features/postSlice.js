import { createSelector, createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: []
  },
  reducers: {
    setPosts: (state, { payload: posts }) => {
      state.posts = posts;
    }
  }
});

const selectPosts = createSelector(
  state => state.posts,

  posts => posts
);

export const postActions = postSlice.actions;
export const postReducer = postSlice.reducer;
export const POST = postSlice.name;
export const postSelector = {
  posts: state => selectPosts(state[POST])
};
