import { createSelector, createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
  name: "tweetSlice",
  initialState: {
    tweets: [],
    tweetStatus: null
  },
  reducers: {
    setTweets: (state, { payload: tweets }) => {
      state.tweets.push(...tweets);
    },
    clearTweets: state => {
      state.tweets = [];
    },
    addTweet: (state, { payload: tweet }) => {
      state.tweets.unshift(tweet);
    },
    removeTweet: (state, { payload: tweetId }) => {
      // 현재 트윗삭제 or 현재 트윗을 리트윗한 트윗 삭제
      state.tweets = state.tweets.filter(
        tweet => tweet.id !== tweetId && tweet.retweetOriginId !== tweetId
      );
    },
    changeTweet: (state, { payload: newTweet }) => {
      const index = state.tweets.findIndex(tweet => tweet.id === newTweet.id);
      state.tweets[index] = newTweet;
    },
    likeTweet: (state, { payload: { myId, tweetId } }) => {
      // 리트윗된 원본의 라이크 변경
      const targetTweet = state.tweets.find(tweet => tweet.id === tweetId);
      if (targetTweet) {
        targetTweet.likers.push({ id: myId });
      }

      // 리트윗한 트윗의 라이크 변경
      state.tweets.forEach(tweet => {
        if (tweet.retweetOriginId === tweetId) {
          tweet.retweetOrigin.likers.push({ id: myId });
        }
      });
    },
    unlikeTweet: (state, { payload: { myId, tweetId } }) => {
      // 리트윗된 원본의 라이크 변경
      const targetTweet = state.tweets.find(tweet => tweet.id === tweetId);

      if (targetTweet) {
        targetTweet.likers = targetTweet.likers.filter(
          liker => liker.id !== myId
        );
      }

      // 리트윗한 트윗의 라이크 변경
      state.tweets.forEach(tweet => {
        if (tweet.retweetOriginId === tweetId) {
          tweet.retweetOrigin.likers = tweet.retweetOrigin.likers.filter(
            liker => liker.id !== myId
          );
        }
      });
    },
    increaseRetweetCount: (state, { payload: retweetOriginId }) => {
      // 리트윗된 원본 트윗의 카운트 변경
      const targetTweet = state.tweets.find(
        tweet => tweet.id === retweetOriginId
      );
      if (targetTweet) {
        targetTweet.retweetedCount++;
      }

      // 기존에 리트윗한 트윗들의 카운트 변경
      for (let i = 0; i < state.tweets.length; i++) {
        if (state.tweets[i].retweetOriginId === retweetOriginId) {
          state.tweets[i].retweetOrigin.retweetedCount++;
        }
      }
    },
    decreaseRetweetCount: (state, { payload: retweetOriginId }) => {
      // 리트윗된 원본 트윗의 카운트 변경
      const targetTweet = state.tweets.find(
        tweet => tweet.id === retweetOriginId
      );
      if (targetTweet) {
        targetTweet.retweetedCount--;
      }

      // 기존에 리트윗한 트윗들의 카운트 변경
      for (let i = 0; i < state.tweets.length; i++) {
        if (state.tweets[i].retweetOriginId === retweetOriginId) {
          state.tweets[i].retweetOrigin.retweetedCount--;
        }
      }
    },
    addComment: (
      state,
      { payload: { currentRetweetId, commentedOriginId, commentTweetId } }
    ) => {
      if (currentRetweetId) {
        // 리트윗 트윗에서 댓글을 추가하는 경우
        const retweet = state.tweets.find(
          tweet => tweet.id === currentRetweetId
        );
        if (retweet) {
          retweet.retweetOrigin.comments.push({ id: commentTweetId });
        }
      }

      // 리트윗 원본 or 일반 트윗에서 댓글을 추가하는 경우
      const commentedOrigin = state.tweets.find(
        tweet => tweet.id === commentedOriginId
      );
      if (commentedOrigin) {
        commentedOrigin.comments.push({ id: commentTweetId });
      }

      // 원본을 리트윗한 트윗의 댓글 카운트도 변경
      const retweet = state.tweets.find(
        tweet => tweet.retweetOriginId === commentedOriginId
      );
      if (retweet && !currentRetweetId) {
        retweet.retweetOrigin.comments.push({ id: commentTweetId });
      }
    },
    removeComment: (
      state,
      { payload: { commentedOriginId, commentTweetId } }
    ) => {
      const commentedOrigin = state.tweets.find(
        tweet => tweet.id === commentedOriginId
      );

      if (commentedOrigin) {
        commentedOrigin.comments = commentedOrigin.comments.filter(
          comment => comment.id !== commentTweetId
        );
      }
    },

    setTweetStatus: (state, { payload: tweet }) => {
      state.tweetStatus = tweet;
    }
  }
});

const selectTweets = createSelector(
  state => state.tweets,

  tweets => tweets
);

const selectTweetStatus = createSelector(
  state => state.tweetStatus,

  tweetStatus => tweetStatus
);

export const tweetActions = tweetSlice.actions;
export const tweetReducer = tweetSlice.reducer;
export const TWEET = tweetSlice.name;
export const tweetSelector = {
  tweets: state => selectTweets(state[TWEET]),
  tweetStatus: state => selectTweetStatus(state[TWEET])
};
