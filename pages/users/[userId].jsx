import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Comment } from "semantic-ui-react";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import ProfileHeader from "../../components/Main/Users/ProfileHeader";
import Follower from "../../components/Main/Users/Follower";
import Following from "../../components/Main/Users/Following";
import { useRouter } from "next/router";
import userFunctions from "../../lib/userFunctions";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId } = router.query;
  console.log("userId", userId);

  const [specificUser, setSpecificUser] = useState(null);
  console.log("specificUser", specificUser);

  useEffect(() => {
    if (userId) {
      getSpecificUser(userId);
    }
  }, [userId]);

  async function getSpecificUser(userId) {
    try {
      const user = await userFunctions.getSpecificUser(userId);
      setSpecificUser(user);
    } catch (error) {
      console.error(error);
    }
  }

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
