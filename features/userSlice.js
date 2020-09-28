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
    },
    addFavoriteTweetsToMe: (state, { payload: tweetId }) => {
      state.currentUser.favorites.push({ id: tweetId });
    },
    removeFavoriteTweetsFromMe: (state, { payload: tweetId }) => {
      state.currentUser.favorites = state.currentUser.favorites.filter(
        tweet => tweet.id !== tweetId
      );
    }
  }
});

const selectCurrentUser = createSelector(
  state => state.currentUser,

  currentUser => currentUser
);

const selectFavoriteTweets = createSelector(
  state => state.currentUser?.favorites,

  favorites => (favorites ? favorites : [])
);

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
export const USER = userSlice.name;
export const userSelector = {
  currentUser: state => selectCurrentUser(state[USER]),
  favoriteTweets: state => selectFavoriteTweets(state[USER])
};
