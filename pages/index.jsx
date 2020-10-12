import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../components/Main/Tweets/TweetForm";
import { userSelector, userActions } from "../features/userSlice";
import tweetFunctions from "../lib/tweetFunctions";
import authFunctions from "../lib/authFunctions";
import ShowTweets from "../components/Main/Tweets/ShowTweets";
import { specificTweetSelector } from "../features/specificTweetSlice";
import useTweetGetter from "../hooks/useTweetGetter";

function Index() {
  const dispatch = useDispatch();

  const currentUser = useSelector(userSelector.currentUser);
  const nowWhere = useSelector(userSelector.nowWhere);
  console.log("currentUser", currentUser);

  const { tweets, getTweets } = useTweetGetter(tweetFunctions.getTweets);

  // 회원가입 or 로그인 시 유저정보 가져오기
  useEffect(() => {
    if (!currentUser) {
      try {
        getLoginUserInfo();
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (nowWhere === "main") {
      getTweets();
    }

    return () => {
      dispatch(userActions.setNowWhere(null));
    };
  }, [nowWhere]);

  async function getLoginUserInfo() {
    const user = await authFunctions.getLoginUserInfo();
    dispatch(userActions.setCurrentUser(user));
  }

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        {currentUser && <TweetForm />}
        <Divider />

        {/* 트윗들 랜더링 */}
        <ShowTweets tweets={tweets} />
      </Grid.Column>
    </Grid>
  );
}

export default Index;
