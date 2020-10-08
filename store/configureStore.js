import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { USER, userReducer } from "../features/userSlice";
import { TWEET, tweetReducer } from "../features/tweetSlice";
import { SPECIFIC_USER, specificUserReducer } from "../features/specificUser";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      // console.log("HYDRATE----------", action);
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        [USER]: userReducer,
        [TWEET]: tweetReducer,
        [SPECIFIC_USER]: specificUserReducer
      });
      return combineReducer(state, action);
    }
  }
};

const makeStore = context => {
  // console.log("context in configureStore", context);
  const store = configureStore({
    reducer: rootReducer
  });

  return store;
};

const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV === "development"
  // debug= true인 경우 설명이 자세하게 나오니
  // 개발 환경에서는 true로 하는 것이 좋음
});

export default wrapper;
