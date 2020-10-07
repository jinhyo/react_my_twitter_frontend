import { createSelector, createSlice } from "@reduxjs/toolkit";

const INITIAL_SPECIFIC_USER_INFO = {
  user: null,
  followers: [],
  followings: [],
  tweets: [],
  comments: [],
  mediaTweets: [],
  favorites: []
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    currentUser: null,
    specificUser: INITIAL_SPECIFIC_USER_INFO
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
    },

    setSpecificUser: (state, { payload: user }) => {
      state.specificUser.user = user;
    },
    setSpecificUsersFollowers: (state, { payload: followers }) => {
      state.specificUser.followers = followers;
    },
    setSpecificUsersFollowings: (state, { payload: followings }) => {
      state.specificUser.followings = followings;
    },
    setSpecificUsersTweets: (state, { payload: tweets }) => {
      state.specificUser.tweets = tweets;
    },
    setSpecificUsersComments: (state, { payload: comments }) => {
      state.specificUser.comments = comments;
    },
    setSpecificUsersMediaTweets: (state, { payload: mediaTweets }) => {
      console.log("~~~~mediaTweets", mediaTweets);

      state.specificUser.mediaTweets = mediaTweets;
    },
    setSpecificUsersFavorites: (state, { payload: favorites }) => {
      state.specificUser.favorites = favorites;
    },
    clearSpecificUserInfos: state => {
      state.specificUser = INITIAL_SPECIFIC_USER_INFO;
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

  followings => (followings ? followings : [])
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

const selectSpecificUser = createSelector(
  state => state.specificUser.user,

  specificUser => specificUser
);

const selectSpecificUsersFollowers = createSelector(
  state => state.specificUser.followers,

  followers => followers
);

const selectSpecificUsersFollowings = createSelector(
  state => state.specificUser.followings,

  followings => followings
);

const selectSpecificUsersTweets = createSelector(
  state => state.specificUser.tweets,

  tweets => tweets
);

const selectSpecificUsersComments = createSelector(
  state => state.specificUser.comments,

  comments => comments
);

const selectSpecificUsersMediaTweets = createSelector(
  state => state.specificUser.mediaTweets,

  mediaTweets => mediaTweets
);

const selectSpecificUsersFavorites = createSelector(
  state => state.specificUser.favorites,

  favorites => favorites
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
  myTweets: state => selectMyTweets(state[USER]),

  specificUser: state => selectSpecificUser(state[USER]),
  specificUsersFollowers: state => selectSpecificUsersFollowers(state[USER]),
  specificUsersFollowings: state => selectSpecificUsersFollowings(state[USER]),
  specificUsersTweets: state => selectSpecificUsersTweets(state[USER]),
  specificUsersComments: state => selectSpecificUsersComments(state[USER]),
  specificUsersMediaTweets: state =>
    selectSpecificUsersMediaTweets(state[USER]),
  specificUsersFavorites: state => selectSpecificUsersFavorites(state[USER])
};
