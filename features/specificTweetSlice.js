import { createSelector, createSlice } from "@reduxjs/toolkit";

const specificTweetSlice = createSlice({
  name: "specificTweetSlice",
  initialState: {
    specificTweet: null,
    likers: [],
    retweetUsers: [],
    currentMenuItem: null
  },
  reducers: {
    setTweet: (state, { payload: tweet }) => {
      state.specificTweet = tweet;
    },
    clearTweet: state => {
      state.specificTweet = null;
    },
    // 트윗 상세보기 매뉴 선택
    setCurrentMenuItem: (state, { payload: item }) => {
      state.currentMenuItem = item;
    },

    /* 좋아요 제어 */

    setLikers: (state, { payload: users }) => {
      state.likers = users;
    },
    addLiker: (state, { payload: userInfo }) => {
      state.likers.unshift(userInfo);
      state.specificTweet.likers.push({ id: userInfo.id });
    },
    removeLiker: (state, { payload: userId }) => {
      state.likers = state.likers.filter(user => user.id !== userId);
      state.specificTweet.likers = state.specificTweet.likers.filter(
        user => user.id !== userId
      );
    },

    /* 리트윗  제어 */

    setRetweetUsers: (state, { payload: users }) => {
      state.retweetUsers = users;
    },

    addRetweet: (state, { payload: { retweetId, userInfo } }) => {
      state.retweetUsers.unshift(userInfo);

      // 카운트 증가용
      state.specificTweet.retweetedCount++;
      state.specificTweet.retweets.push({ id: retweetId });
    },
    removeRetweet: (state, { payload: { retweetId, userId } }) => {
      state.retweetUsers = state.retweetUsers.filter(
        user => user.id !== userId
      );

      // 카운트 감소용
      state.specificTweet.retweetedCount--;
      state.specificTweet.retweets = state.specificTweet.retweets.filter(
        retweet => retweet.id !== retweetId
      );
    },

    /* 인용한 트윗 제어 */

    addQuotation: (state, { payload: { retweetId } }) => {
      // 카운트 증가용
      state.specificTweet.retweetedCount++;
      state.specificTweet.quotations.push({ id: retweetId });
    },
    removeQuotation: (state, { payload: { retweetId } }) => {
      // 카운트 감소용용
      state.specificTweet.retweetedCount--;
      state.specificTweet.quotations = state.specificTweet.quotations.filter(
        tweet => tweet.id !== retweetId
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

const selectLikers = createSelector(
  state => state.likers,

  likers => likers
);

const selectRetweetUsers = createSelector(
  state => state.retweetUsers,

  retweetUsers => retweetUsers
);

const selectCurrentMenuItem = createSelector(
  state => state.currentMenuItem,

  currentMenuItem => currentMenuItem
);

export const specificTweetActions = specificTweetSlice.actions;
export const specificTweetReducer = specificTweetSlice.reducer;
export const SPECIFIC_TWEET = specificTweetSlice.name;
export const specificTweetSelector = {
  specificTweetId: state => selectSpecificTweetId(state[SPECIFIC_TWEET]),
  specificTweet: state => selectSpecificTweet(state[SPECIFIC_TWEET]),
  likers: state => selectLikers(state[SPECIFIC_TWEET]),
  retweetUsers: state => selectRetweetUsers(state[SPECIFIC_TWEET]),
  currentMenuItem: state => selectCurrentMenuItem(state[SPECIFIC_TWEET])
};
