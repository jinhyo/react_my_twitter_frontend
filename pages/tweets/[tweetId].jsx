import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import { userSelector } from "../../features/userSlice";
import { useRouter } from "next/router";
import tweetFunctions from "../../lib/tweetFunctions";
import TweetInfoCard from "../../components/Main/Tweets/TweetInfoCard";
import { tweetSelector, tweetActions } from "../../features/tweetSlice";

function TweetStatus() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tweetId } = router.query;

  const currentUser = useSelector(userSelector.currentUser);
  const tweetStatus = useSelector(tweetSelector.tweetStatus);

  console.log("~~~tweetStatus", tweetStatus);

  useEffect(() => {
    if (tweetId) {
      getTweetStatus(tweetId);
    }
  }, [tweetId]);

  async function getTweetStatus(tweetId) {
    try {
      const tweet = await tweetFunctions.getTweetStatus(tweetId);
      dispatch(tweetActions.setTweetStatus(tweet));
    } catch (error) {
      console.error(error.response.data || error);
    }
  }

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={5} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={11} computer={10}>
        {tweetStatus && <TweetInfoCard tweet={tweetStatus} />}
      </Grid.Column>
    </Grid>
  );
}

export default TweetStatus;
