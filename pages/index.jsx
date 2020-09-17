import React from "react";
import { Grid } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetFrom from "../components/Main/Tweets/TweetForm";
import TweetCard from "../components/Main/Tweets/TweetCard";

function Index(props) {
  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        <ProfileCard />
        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        <TweetFrom />
        <TweetCard />
      </Grid.Column>
    </Grid>
  );
}

export default Index;
