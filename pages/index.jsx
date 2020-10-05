import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../components/Main/Tweets/TweetForm";
import TweetCard from "../components/Main/Tweets/TweetCard";
import { userSelector, userActions } from "../features/userSlice";
import tweetFunctions from "../lib/tweetFunctions";
import { tweetActions, tweetSelector } from "../features/tweetSlice";
import authFunctions from "../lib/authFunctions";
import PureRetweetCard from "../components/Main/Tweets/PureRetweetCard";

function Index(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);
  const favoriteTweets = useSelector(userSelector.favoriteTweets);
  const myTweets = useSelector(userSelector.myTweets);

  const tweets = useSelector(tweetSelector.tweets);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [loadTweetLoading, setLoadTweetLoading] = useState(true);
  const [clear, setClear] = useState(null);

  console.log("tweets", tweets);
  console.log("currentUser", currentUser);

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
  }, []);

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

  // 내가 좋아요 눌렀는지 확인
  const isFavoriteTweet = useCallback(
    tweetId => {
      const index = favoriteTweets.findIndex(tweet => tweet.id === tweetId);

      return index !== -1;
    },
    [favoriteTweets]
  );

  //// 리트윗인지 확인
  function isRewteet(tweet) {
    return tweet.retweetOriginId;
  }

  //// 내가 댓글을 달았는지 확인
  const didIComment = useCallback(
    currentTweetId => {
      const index = myTweets.findIndex(
        tweet => tweet.commentedOriginId === currentTweetId
      );

      return index !== -1;
    },
    [myTweets]
  );

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
        {tweets.map(tweet =>
          isRewteet(tweet) ? (
            <PureRetweetCard
              key={tweet.id}
              tweet={tweet}
              retweet={tweet.retweetOrigin}
              favoriteStatus={isFavoriteTweet(tweet.retweetOriginId)}
            />
          ) : (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              favoriteStatus={isFavoriteTweet(tweet.id)}
              commentStatus={didIComment(tweet.id)}
            />
          )
        )}
      </Grid.Column>
    </Grid>
  );
}

export default Index;
