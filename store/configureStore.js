import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { USER, userReducer } from "../features/userSlice";
import { TWEET, tweetReducer } from "../features/tweetSlice";
import {
  SPECIFIC_USER,
  specificUserReducer,
} from "../features/specificUserSlice";
import {
  SPECIFIC_TWEET,
  specificTweetReducer,
} from "../features/specificTweetSlice";
import { SEARCH, searchReducer } from "../features/searchSlice";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      const nextState = action.payload;
      //// SSR이후 client state가 action.payload로 오버라이트 되는 것을 방지

      // <Index />, <TweetsWithHashtag />
      if (state[TWEET].hashtagTrend) {
        nextState[TWEET].hashtagTrend = state[TWEET].hashtagTrend;
      }
      if (state[TWEET].tweets) {
        nextState[TWEET].tweets = state[TWEET].tweets;
      }

      // <TweetStatus />
      if (state[SPECIFIC_TWEET].specificTweet) {
        nextState[SPECIFIC_TWEET].specificTweet =
          state[SPECIFIC_TWEET].specificTweet;

        nextState[SPECIFIC_TWEET].currentMenuItem =
          state[SPECIFIC_TWEET].currentMenuItem;
      }

      // <Profile />
      if (state[SPECIFIC_USER].specificUser.user) {
        nextState[SPECIFIC_USER].specificUser =
          state[SPECIFIC_USER].specificUser;
        nextState[SPECIFIC_USER].totalTweetCount =
          state[SPECIFIC_USER].totalTweetCount;
        nextState[SPECIFIC_USER].count = state[SPECIFIC_USER].count;
      }

      return nextState;
    default: {
      const combineReducer = combineReducers({
        [USER]: userReducer,
        [TWEET]: tweetReducer,
        [SPECIFIC_USER]: specificUserReducer,
        [SPECIFIC_TWEET]: specificTweetReducer,
        [SEARCH]: searchReducer,
      });
      return combineReducer(state, action);
    }
  }
};

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const makeStore = (context) => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};

const wrapper = createWrapper(
  makeStore /* {
  debug: process.env.NODE_ENV === "development"
} */
);

export default wrapper;
