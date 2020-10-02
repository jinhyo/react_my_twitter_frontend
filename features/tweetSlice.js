import { createSelector, createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
  name: "tweetSlice",
  initialState: {
    tweets: []
  },
  reducers: {
    setTweets: (state, { payload: tweets }) => {
      state.tweets.push(...tweets);
    },
    addTweet: (state, { payload: tweet }) => {
      state.tweets.unshift(tweet);
    },
    removeTweet: (state, { payload: tweetId }) => {
      state.tweets = state.tweets.filter(tweet => tweet.id !== tweetId);
    },
    changeTweet: (state, { payload: newTweet }) => {
      const index = state.tweets.findIndex(tweet => tweet.id === newTweet.id);
      state.tweets[index] = newTweet;
    },
    likeTweet: (state, { payload: { myId, tweetId } }) => {
      const targetTweet = state.tweets.find(tweet => tweet.id === tweetId);
      targetTweet.likers.push({ id: myId });
    },
    unlikeTweet: (state, { payload: { myId, tweetId } }) => {
      const targetTweet = state.tweets.find(tweet => tweet.id === tweetId);
      targetTweet.likers = targetTweet.likers.filter(
        liker => liker.id !== myId
      );
    },
    increaseRetweetCount: (state, { payload: tweetId }) => {
      // 리트윗된 원본 트윗의 카운트 변경
      const targetTweet = state.tweets.find(tweet => tweet.id === tweetId);
      targetTweet.retweetedCount++;

      // 기존에 리트윗한 트윗들의 카운트 변경
      for (let i = 0; i < state.tweets.length; i++) {
        if (state.tweets[i].retweetOriginId === tweetId) {
          state.tweets[i].retweetOrigin.retweetedCount++;
        }
      }
    },
    decreaseRetweetCount: (state, { payload: tweetId }) => {
      // 리트윗된 원본 트윗의 카운트 변경
      const targetTweet = state.tweets.find(tweet => tweet.id === tweetId);
      targetTweet.retweetedCount--;

      // 기존에 리트윗한 트윗들의 카운트 변경
      for (let i = 0; i < state.tweets.length; i++) {
        if (state.tweets[i].retweetOriginId === tweetId) {
          state.tweets[i].retweetOrigin.retweetedCount--;
        }
      }
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
