import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../../components/Main/Tweets/TweetForm";
import TweetCard from "../../components/Main/Tweets/TweetCard";
import { userSelector } from "../../features/userSlice";
import { useRouter } from "next/router";

function Tweets(props) {
  const router = useRouter();
  const { tagName } = router.query;
  const dispatch = useDispatch();

  const currentUser = useSelector(userSelector.currentUser);

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}></Grid.Column>
    </Grid>
  );
}

export default Tweets;
