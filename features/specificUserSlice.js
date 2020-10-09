import { createSelector, createSlice } from "@reduxjs/toolkit";

const TWEET_KEYS = ["tweets", "commentTweets", "mediaTweets", "favoriteTweets"];

const INITIAL_SPECIFIC_USER_INFO = {
  user: null,
  followers: [],
  followings: [],
  tweets: [],
  commentTweets: [],
  mediaTweets: [],
  favoriteTweets: []
};

const INITIAL_COUNTS = {
  tweets: 0,
  commentTweets: 0,
  mediaTweets: 0,
  favoriteTweets: 0
};

const specificUserSlice = createSlice({
  name: "specificUserSlice",
  initialState: {
    specificUser: INITIAL_SPECIFIC_USER_INFO,
    totalTweetCount: 0,
    count: INITIAL_COUNTS
  },
  reducers: {
    setUser: (state, { payload: user }) => {
      state.specificUser.user = user;
    },
    setFollowers: (state, { payload: followers }) => {
      state.specificUser.followers = followers;
    },
    setFollowings: (state, { payload: followings }) => {
      state.specificUser.followings = followings;
    },
    setTweets: (state, { payload: tweets }) => {
      state.specificUser.tweets = tweets;
    },
    setCommentTweets: (state, { payload: commentTweets }) => {
      state.specificUser.commentTweets = commentTweets;
    },
    setMediaTweets: (state, { payload: mediaTweets }) => {
      state.specificUser.mediaTweets = mediaTweets;
    },
    setFavoriteTweets: (state, { payload: favoriteTweets }) => {
      state.specificUser.favoriteTweets = favoriteTweets;
    },
    clearUserInfos: state => {
      state.specificUser = INITIAL_SPECIFIC_USER_INFO;
    },

    /* 카운트 */
    changeTotalTweetCount: (state, { payload: number }) => {
      state.totalTweetCount += number;
    },
    changeTweetCount: (state, { payload: number }) => {
      state.count.tweets += number;
    },
    changeCommentTweetCount: (state, { payload: number }) => {
      state.count.commentTweets += number;
    },
    changeMediaTweetCount: (state, { payload: number }) => {
      state.count.mediaTweets += number;
    },
    changeFavoriteTweetCount: (state, { payload: number }) => {
      state.count.favoriteTweets += number;
    },
    clearCounts: state => {
      state.totalTweetCount = 0;
      state.count = INITIAL_COUNTS;
    },

    likeTweet: (state, { payload: { myId, tweetId } }) => {
      // 리트윗된 원본의 좋아요 변경
      TWEET_KEYS.forEach(key => {
        const targetTweet = state.specificUser[key].find(
          tweet => tweet.id === tweetId
        );
        if (targetTweet) {
          targetTweet.likers.push({ id: myId });
        }
      });

      // 리트윗한 트윗의 좋아요 변경
      TWEET_KEYS.forEach(key => {
        state.specificUser[key].forEach(tweet => {
          if (tweet.retweetOriginId === tweetId) {
            tweet.retweetOrigin.likers.push({ id: myId });
          }
        });
      });
    },
    unlikeTweet: (state, { payload: { myId, tweetId } }) => {
      // 리트윗된 원본의 좋아요 변경
      TWEET_KEYS.forEach(key => {
        const targetTweet = state.specificUser[key].find(
          tweet => tweet.id === tweetId
        );
        if (targetTweet) {
          targetTweet.likers = targetTweet.likers.filter(
            liker => liker.id !== myId
          );
        }
      });

      // 리트윗한 트윗의 좋아요 변경
      TWEET_KEYS.forEach(key => {
        state.specificUser[key].forEach(tweet => {
          if (tweet.retweetOriginId === tweetId) {
            tweet.retweetOrigin.likers = tweet.retweetOrigin.likers.filter(
              liker => liker.id !== myId
            );
          }
        });
      });
    },

    increaseRetweetCount: (state, { payload: tweetId }) => {
      // 리트윗된 원본 트윗의 카운트 변경
      TWEET_KEYS.forEach(key => {
        const retweetOrigin = state.specificUser[key].find(
          tweet => tweet.id === tweetId
        );
        if (retweetOrigin) {
          retweetOrigin.retweetedCount++;
        }
      });

      // 기존에 리트윗한 트윗들의 카운트 변경
      TWEET_KEYS.forEach(key => {
        const retweet = state.specificUser[key].find(
          tweet => tweet.retweetOriginId === tweetId
        );
        if (retweet) {
          retweet.retweetedCount++;
        }
      });
    },
    decreaseRetweetCount: (state, { payload: tweetId }) => {
      // 리트윗된 원본 트윗의 카운트 변경
      TWEET_KEYS.forEach(key => {
        const retweetOrigin = state.specificUser[key].find(
          tweet => tweet.id === tweetId
        );
        if (retweetOrigin) {
          retweetOrigin.retweetedCount--;
        }
      });

      // 기존에 리트윗한 트윗들의 카운트 변경
      TWEET_KEYS.forEach(key => {
        const retweet = state.specificUser[key].find(
          tweet => tweet.retweetOriginId === tweetId
        );
        if (retweet) {
          retweet.retweetedCount--;
        }
      });
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

        retweet.retweetOrigin.comments.push({ id: commentTweetId });
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
      commentedOrigin.comments = commentedOrigin.comments.filter(
        comment => comment.id !== commentTweetId
      );
    }
  }
});

const selectUser = createSelector(
  state => state.specificUser.user,

  specificUser => specificUser
);

const selectUserId = createSelector(
  state => state.specificUser.user?.id,

  specificUserId => specificUserId
);

const selectFollowers = createSelector(
  state => state.specificUser.followers,

  followers => followers
);

const selectFollowings = createSelector(
  state => state.specificUser.followings,

  followings => followings
);

const selectTweets = createSelector(
  state => state.specificUser.tweets,

  tweets => tweets
);

const selectComments = createSelector(
  state => state.specificUser.commentTweets,

  commentTweets => commentTweets
);

const selectMediaTweets = createSelector(
  state => state.specificUser.mediaTweets,

  mediaTweets => mediaTweets
);

const selectFavorites = createSelector(
  state => state.specificUser.favoriteTweets,

  favoriteTweets => favoriteTweets
);

/* 카운트 */
const selectTweetCounts = createSelector(
  state => state.count,

  count => count
);

const selectTotalTweetCount = createSelector(
  state => state.totalTweetCount,

  totalTweetCount => totalTweetCount
);

export const specificUserActions = specificUserSlice.actions;
export const specificUserReducer = specificUserSlice.reducer;
export const SPECIFIC_USER = specificUserSlice.name;
export const specificUserSelector = {
  user: state => selectUser(state[SPECIFIC_USER]),
  userId: state => selectUserId(state[SPECIFIC_USER]),
  followers: state => selectFollowers(state[SPECIFIC_USER]),
  followings: state => selectFollowings(state[SPECIFIC_USER]),
  tweets: state => selectTweets(state[SPECIFIC_USER]),
  commentTweets: state => selectComments(state[SPECIFIC_USER]),
  mediaTweets: state => selectMediaTweets(state[SPECIFIC_USER]),
  favoriteTweets: state => selectFavorites(state[SPECIFIC_USER]),
  tweetCounts: state => selectTweetCounts(state[SPECIFIC_USER]),
  totalTweetCount: state => selectTotalTweetCount(state[SPECIFIC_USER])
};
