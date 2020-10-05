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
    addMyTweet: (
      state,
      {
        payload: { tweetId, retweetOriginId, quotedOriginId, commentedOriginId }
      }
    ) => {
      state.currentUser.tweets.push({
        id: tweetId,
        retweetOriginId,
        quotedOriginId,
        commentedOriginId
      });
    },
    removeMyTweet: (state, { payload: deltedTweetIds }) => {
      state.currentUser.tweets = state.currentUser.tweets.filter(
        tweet => !deltedTweetIds.includes(tweet.id)
      );
    },
    addFavoriteTweetsToMe: (state, { payload: tweetId }) => {
      state.currentUser.favorites.push({ id: tweetId });
    },
    removeFavoriteTweetsFromMe: (state, { payload: tweetId }) => {
      state.currentUser.favorites = state.currentUser.favorites.filter(
        tweet => tweet.id !== tweetId
      );
    },
    addFollowing: (state, { payload: userId }) => {
      state.currentUser.followings.push({ id: userId });
    },
    removeFollowing: (state, { payload: userId }) => {
      state.currentUser.followings = state.currentUser.followings.filter(
        following => following.id !== userId
      );
    },
    addRetweetToMe: (state, { payload: tweetId }) => {
      state.currentUser.retweets.push({ id: tweetId });
    },
    removeRtweetFromMe: (state, { payload: tweetId }) => {
      state.currentUser.retweets = state.currentUser.retweets.filter(
        tweet => tweet.id !== tweetId
      );
    }
  }
});

const selectCurrentUser = createSelector(
  state => state.currentUser,

  currentUser => currentUser
);

const selectCurrentUserId = createSelector(
  state => state.currentUser?.id,

  currentUserId => currentUserId
);

const selectFollowings = createSelector(
  state => state.currentUser?.followings,

  followings => followings
);

const selectRetweets = createSelector(
  state => state.currentUser?.retweets,

  retweets => (retweets ? retweets : [])
);

const selectFavoriteTweets = createSelector(
  state => state.currentUser?.favorites,

  favorites => (favorites ? favorites : [])
);

const selectMyTweets = createSelector(
  state => state.currentUser?.tweets,

  tweets => (tweets ? tweets : [])
);

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
export const USER = userSlice.name;
export const userSelector = {
  currentUser: state => selectCurrentUser(state[USER]),
  favoriteTweets: state => selectFavoriteTweets(state[USER]),
  currentUserId: state => selectCurrentUserId(state[USER]),
  followings: state => selectFollowings(state[USER]),
  myRetweets: state => selectRetweets(state[USER]),
  myTweets: state => selectMyTweets(state[USER])
};
