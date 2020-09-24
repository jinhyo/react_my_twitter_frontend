import { createSelector, createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
  name: "tweetSlice",
  initialState: {
    tweets: []
  },
  reducers: {
    setTweets: (state, { payload: tweets }) => {
      state.tweets = tweets;
    }
  }
});

const selectTweets = createSelector(
  state => state.tweets,

  tweets => tweets
);

export const tweetActions = tweetSlice.actions;
export const tweetReducer = tweetSlice.reducer;
export const TWEET = tweetSlice.name;
export const tweetSelector = {
  tweets: state => selectTweets(state[TWEET])
};
