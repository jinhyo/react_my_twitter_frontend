import React from "react";
import { Grid, Comment } from "semantic-ui-react";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import ProfileHeader from "../components/Main/Profile/ProfileHeader";
import Follower from "../components/Main/Profile/Follower";
import Following from "../components/Main/Profile/Following";

function Profile(props) {
  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        <ProfileHeader />
        <Comment.Group>
          <Follower />
          <Following />
        </Comment.Group>
      </Grid.Column>
    </Grid>
  );
}

export default Profile;
