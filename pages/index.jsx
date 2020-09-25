import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../components/Main/Tweets/TweetForm";
import TweetCard from "../components/Main/Tweets/TweetCard";
import { userSelector, userActions } from "../features/userSlice";
import authFunctions from "../lib/authFunctions";
import tweetFunctions from "../lib/tweetFunctions";

function Index(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  const [tweets, setTweets] = useState([]);

  console.log("tweets", tweets);

  useEffect(() => {
    getTweets();
  }, []);

  async function getTweets(lastId = null) {
    try {
      const tweets = await tweetFunctions.getTweets(lastId);
      setTweets(prev => [...prev, ...tweets]);
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
