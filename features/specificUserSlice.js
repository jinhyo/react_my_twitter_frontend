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
    /* 초기 세팅 */

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

    /* 카운트 변경 */

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

    /* 유저 프로필 내의 정보 변경 */

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
    increaseCommentCount: (
      state,
      { payload: { commentTweetId, currentTweetId } }
    ) => {
      const currentTweet = state.specificUser.tweets.find(
        tweet => tweet.id === currentTweetId
      );
      currentTweet.comments.push({ id: commentTweetId });
    },
    addComment: (
      state,
      {
        payload: { currentRetweetId, commentedOriginId, commentTweetId, tweet }
      }
    ) => {
      state.specificUser.commentTweets.unshift(tweet);

      if (currentRetweetId) {
        // 리트윗 트윗에서 댓글을 추가하는 경우
        TWEET_KEYS.forEach(key => {
          const retweet = state.specificUser[key].find(
            tweet => tweet.id === currentRetweetId
          );
          if (retweet) {
            retweet.retweetOrigin.comments.push({ id: commentTweetId });
          }
        });
      }

      // 리트윗 원본 or 일반 트윗에서 댓글을 추가하는 경우
      TWEET_KEYS.forEach(key => {
        const commentedOrigin = state.specificUser[key].find(
          tweet => tweet.id === commentedOriginId
        );
        if (commentedOrigin) {
          commentedOrigin.comments.push({ id: commentTweetId });
        }
      });

      // 원본을 리트윗한 트윗의 댓글도 추가
      TWEET_KEYS.forEach(key => {
        const retweet = state.specificUser[key].find(
          tweet => tweet.retweetOriginId === commentedOriginId
        );
        if (retweet && !currentRetweetId) {
          retweet.retweetOrigin.comments.push({ id: commentTweetId });
        }
      });

      // 댓글에 이미지가 있을 경우 미디어 매뉴의 카운트 및 미디어 트윗 추가
      if (tweet.hasMedia) {
        state.count.mediaTweets++;
        state.specificUser.mediaTweets.unshift(tweet);
      }

      // 전체 트윗 카운트 증가
      state.totalTweetCount++;

      // 댓글 매뉴 카운트 증가
      state.count.commentTweets++;
    },
    removeComment: (
      state,
      { payload: { commentedOriginId, commentTweetId } }
    ) => {
      TWEET_KEYS.forEach(key => {
        const commentedOrigin = state.specificUser[key].find(
          tweet => tweet.id === commentedOriginId
        );
        if (commentedOrigin) {
          commentedOrigin.comments = commentedOrigin.comments.filter(
            comment => comment.id !== commentTweetId
          );
        }
      });
    },

    /* 내 프로필 내의 정보 변경 */

    removeFavoriteTweet: (state, { payload: favoriteTweetId }) => {
      state.specificUser.favoriteTweets = state.specificUser.favoriteTweets.filter(
        tweet => tweet.id !== favoriteTweetId
      );
    },
    removeTweet: (state, { payload: tweetId }) => {
      TWEET_KEYS.forEach(key => {
        state.specificUser[key] = state.specificUser[key].filter(tweet => {
          // 현재 트윗삭제 or 현재 트윗을 리트윗한 트윗 삭제
          const result =
            tweet.id !== tweetId && tweet.retweetOriginId !== tweetId;

          if (!result) {
            // 트윗, 댓글, 미디어, 좋아요 중 해당하는 메뉴항목의 카운트 감소 & 전체 카운트 감소
            state.count[key]--;
            state.totalTweetCount--;

            if (tweet.hasMedia) {
              // 미디어 트윗의 경우 트윗과 미디어 메뉴 양쪽에 있으니 전체 카운트 감소는 한번만
              // 미디어 트윗은 트윗과 미디어 메뉴에 중복되어 있으니 중복 카운트 제한
              state.count.mediaTweets--;
              state.specificUser.mediaTweets = state.specificUser.mediaTweets.filter(
                mediatTweet => mediatTweet.id !== tweet.id
              );
            }

            // 좋아요 누른 트윗을 삭제할 경우 트윗과 좋아요 메뉴항목 모두 카운트 감소
            // 리트윗한 트윗과 리트윗된 트윗에 좋아요가 있을 경우 좋아요 카운트는 하나만 감소
            const index = tweet.likers.findIndex(
              liker => liker.id === tweet.user.id
            );
            if (index !== -1) {
              // 좋아요 매뉴에서 삭제할 경우 트윗 항목에도 있으니 카운트는 하나만 감소 (현재 3감소)
              state.count.favoriteTweets--;
              state.specificUser.favoriteTweets = state.specificUser.favoriteTweets.filter(
                favoriteTweet => favoriteTweet.id !== tweet.id
              );
            }
          }

          return result;
        });
      });
    },
    addTweet: (state, { payload: tweet }) => {
      state.specificUser.tweets.unshift(tweet);
      state.totalTweetCount++;
      state.count.tweets++;
    },
    cancelRetweet: (state, { payload: tweetId }) => {
      state.specificUser.tweets = state.specificUser.tweets.filter(
        tweet => tweet.id !== tweetId
      );
      state.totalTweetCount--;
      state.count.tweets--;
    },
    removeFollowing: (state, { payload: followerId }) => {
      // 카운트 변경
      state.specificUser.user.followings = state.specificUser.user.followings.filter(
        follower => follower.id !== followerId
      );

      // 팔로잉 메뉴에서 제거
      state.specificUser.followings = state.specificUser.followings.filter(
        follower => follower.id !== followerId
      );
    },
    addFollowing: (state, { payload: followerId }) => {
      // 카운트 변경
      state.specificUser.user.followings.unshift({ id: followerId });
    },
    removeFollower: (state, { payload: followerId }) => {
      // 카운트 변경
      state.specificUser.user.followers = state.specificUser.user.followers.filter(
        follower => follower.id !== followerId
      );

      // 팔로워 메뉴에서 제거
      state.specificUser.followers = state.specificUser.followers.filter(
        follower => follower.id !== followerId
      );
    },
    addFollower: (state, { payload: userCardInfo }) => {
      // 카운트 변경
      state.specificUser.user.followers.unshift({ id: userCardInfo.id });
      state.specificUser.followers.unshift(userCardInfo);
    },

    /* 프로필 변경 */
    editProfile: (state, { payload: profile }) => {
      state.specificUser.user.nickname = profile.nickname;
      state.specificUser.user.location = profile.location;
      state.specificUser.user.selfIntro = profile.selfIntro;
    },
    updateAvatarURL: (state, { payload: url }) => {
      state.specificUser.user.avatarURL = url;
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
