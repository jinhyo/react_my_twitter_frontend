import { createSelector, createSlice } from "@reduxjs/toolkit";

const specificTweetSlice = createSlice({
  name: "specificTweetSlice",
  initialState: {
    specificTweet: null
  },
  reducers: {
    setTweet: (state, { payload: tweet }) => {
      state.specificTweet = tweet;
    },
    clearTweet: state => {
      state.specificTweet = null;
    }
  }
});

const selectSpecificTweetId = createSelector(
  state => state.specificTweet?.id,

  specificTweetId => specificTweetId
);

const selectSpecificTweet = createSelector(
  state => state.specificTweet,

  specificTweet => specificTweet
);

export const specificTweetActions = specificTweetSlice.actions;
export const specificTweetReducer = specificTweetSlice.reducer;
export const SPECIFIC_TWEET = specificTweetSlice.name;
export const specificTweetSelector = {
  specificTweetId: state => selectSpecificTweetId(state[SPECIFIC_TWEET]),
  specificTweet: state => selectSpecificTweet(state[SPECIFIC_TWEET])
};
