import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Grid, Comment, Loader } from "semantic-ui-react";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import ProfileHeader from "../../components/Main/Users/ProfileHeader";
import Follower from "../../components/Main/Users/Follower";
import Following from "../../components/Main/Users/Following";
import { useRouter } from "next/router";
import userFunctions from "../../lib/userFunctions";
import ProfileMenu from "../../components/Main/Users/ProfileMenu";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId } = router.query;

  const [specificUser, setSpecificUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("tweets");
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

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "tweets") {
      } else if (name === "replies") {
      } else if (name === "medias") {
      } else if (name === "followers") {
      } else if (name === "followings") {
      } else if (name === "likedTweets") {
      }
    },
    [specificUser]
  );

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        <ProfileHeader
          user={specificUser}
          setLoading={setLoading}
          handleItemClick={handleItemClick}
          activeItem={activeItem}
        />
        <ProfileMenu
          user={specificUser}
          setLoading={setLoading}
          handleItemClick={handleItemClick}
          activeItem={activeItem}
        />

        <Loader size="small" active={loading} />

        {/* 트윗들  */}

        {/* 댓글들 */}

        {/* 미더어 트윗들 */}

        {/* 좋아요 누른 트윗들 */}

        {/* <Comment.Group>
          <Follower />
          <Following />
        </Comment.Group> */}
      </Grid.Column>
    </Grid>
  );
}

export default Profile;
