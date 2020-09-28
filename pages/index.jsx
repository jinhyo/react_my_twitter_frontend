import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../components/Main/Tweets/TweetForm";
import TweetCard from "../components/Main/Tweets/TweetCard";
import { userSelector, userActions } from "../features/userSlice";
import tweetFunctions from "../lib/tweetFunctions";

function Index(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  const [tweets, setTweets] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [loadTweetLoading, setLoadTweetLoading] = useState(false);
  const [clear, setClear] = useState(null);

  console.log("tweets", tweets);
  console.log("hasMorePosts", hasMorePosts);
  console.log("loadTweetLoading", loadTweetLoading);

  useEffect(() => {
    getTweets();
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

  // 스크롤이 최하단에 가까워지면 트윗들을 추가로 가져옴
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
      setTweets(prev => [...prev, ...newTweets]);
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
        <TweetForm />

        {tweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </Grid.Column>
    </Grid>
  );
}

export default Index;
