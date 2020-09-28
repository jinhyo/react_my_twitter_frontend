import { createSelector, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    currentUser: null
  },
  reducers: {
    setCurrentUser: (state, { payload: user }) => {
      state.currentUser = user;
    },
    clearCurrentUser: state => {
      state.currentUser = null;
    },
    addMyTweet: (state, { payload: tweetId }) => {
      state.currentUser.tweets.push({ id: tweetId });
    }
  }
});

const selectCurrentUser = createSelector(
  state => state.currentUser,

  currentUser => currentUser
);

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
export const USER = userSlice.name;
export const userSelector = {
  currentUser: state => selectCurrentUser(state[USER])
};
