import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../components/Main/Tweets/TweetForm";
import { userSelector, userActions } from "../features/userSlice";
import tweetFunctions from "../lib/tweetFunctions";
import { tweetActions, tweetSelector } from "../features/tweetSlice";
import authFunctions from "../lib/authFunctions";
import ShowTweets from "../components/Main/Tweets/ShowTweets";
import {
  specificTweetActions,
  specificTweetSelector
} from "../features/specificTweetSlice";

function Index() {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  const tweets = useSelector(tweetSelector.tweets);
  const specificTweetId = useSelector(specificTweetSelector.specificTweetId);

  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [loadTweetLoading, setLoadTweetLoading] = useState(true);
  const [clear, setClear] = useState(null);

  console.log("tweets", tweets);
  console.log("currentUser", currentUser);
  console.log("specificTweetId", specificTweetId);

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
    if (!tweets.length) {
      getTweets();
    }

    return () => {
      console.log("in Index");
      dispatch(tweetActions.clearTweets());
    };
  }, [specificTweetId]);

  useEffect(() => {
    window.addEventListener("scroll", getMoreTweets);
    return () => {
      window.removeEventListener("scroll", getMoreTweets);
    };
  }, [tweets, loadTweetLoading, hasMorePosts]);

  useEffect(() => {
    return () => {
      clearTimeout(clear);
    };
  }, [clear]);

  async function getLoginUserInfo() {
    const user = await authFunctions.getLoginUserInfo();
    dispatch(userActions.setCurrentUser(user));
  }

  //// 스크롤이 최하단에 가까워지면 트윗들을 추가로 가져옴
  async function getMoreTweets() {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePosts && !loadTweetLoading) {
        const lastId = tweets[tweets.length - 1]?.id;
        await getTweets(lastId);
      }
    }
  }

  function setTweetLoading() {
    setLoadTweetLoading(true);
    const clear = setTimeout(() => {
      setLoadTweetLoading(false);
    }, 3000);

    setClear(clear);
  }

  async function getTweets(lastId = null) {
    try {
      setTweetLoading();
      const newTweets = await tweetFunctions.getTweets(lastId);
      setHasMorePosts(newTweets.length === 10);
      dispatch(tweetActions.setTweets(newTweets));
    } catch (error) {
      console.error(error);
    }
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
