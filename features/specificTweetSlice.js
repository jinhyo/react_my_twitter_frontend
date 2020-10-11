import { createSelector, createSlice } from "@reduxjs/toolkit";

const specificTweetSlice = createSlice({
  name: "specificTweetSlice",
  initialState: {
    specificTweet: null,
    likersOrRetweeters: []
  },
  reducers: {
    setTweet: (state, { payload: tweet }) => {
      state.specificTweet = tweet;
    },
    clearTweet: state => {
      state.specificTweet = null;
    },
    setlikersOrRetweeters: (state, { payload: users }) => {
      state.likersOrRetweeters = users;
    },
    addlikersOrRetweeters: (state, { payload: user }) => {
      state.likersOrRetweeters.unshift(user);
    },
    removelikersOrRetweeters: (state, { payload: userId }) => {
      state.likersOrRetweeters = state.likersOrRetweeters.filter(
        user => user.id !== userId
      );
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

const selectlikersOrRetweeters = createSelector(
  state => state.likersOrRetweeters,

  likersOrRetweeters => likersOrRetweeters
);

export const specificTweetActions = specificTweetSlice.actions;
export const specificTweetReducer = specificTweetSlice.reducer;
export const SPECIFIC_TWEET = specificTweetSlice.name;
export const specificTweetSelector = {
  specificTweetId: state => selectSpecificTweetId(state[SPECIFIC_TWEET]),
  specificTweet: state => selectSpecificTweet(state[SPECIFIC_TWEET]),
  likersOrRetweeters: state => selectlikersOrRetweeters(state[SPECIFIC_TWEET])
};
