import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Comment, Loader } from "semantic-ui-react";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import ProfileHeader from "../../components/Main/Users/ProfileHeader";
import Follower from "../../components/Main/Users/Follower";
import Following from "../../components/Main/Users/Following";
import { useRouter } from "next/router";
import userFunctions from "../../lib/userFunctions";
import ProfileMenu from "../../components/Main/Users/ProfileMenu";
import { userActions, userSelector } from "../../features/userSlice";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId } = router.query;

  const specificUser = useSelector(userSelector.specificUser);
  const followers = useSelector(userSelector.specificUsersFollowers);
  const followings = useSelector(userSelector.specificUsersFollowings);

  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("tweets");
  const [totalTweetCount, setTotalTweetCount] = useState(0);

  console.log("specificUser", specificUser);
  console.log("followers", followers);
  console.log("followings", followings);

  useEffect(() => {
    if (userId) {
      getSpecificUser(userId);
    }
  }, [userId]);

  async function getSpecificUser(userId) {
    try {
      const user = await userFunctions.getSpecificUser(userId);
      dispatch(userActions.setSpecificUser(user));
      setTotalTweetCount(user.tweets.length);
    } catch (error) {
      console.error(error);
    }
  }

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "tweets") {
      } else if (name === "comments") {
      } else if (name === "medias") {
      } else if (name === "followers") {
        getFollowers(specificUser.id);
      } else if (name === "followings") {
        getFollowings(specificUser.id);
      } else if (name === "likedTweets") {
      }
    },
    [specificUser]
  );

  async function getFollowers(userId) {
    try {
      setLoading(true);
      const followers = await userFunctions.getFollowers(userId);
      dispatch(userActions.setSpecificUsersFollowers(followers));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getFollowings(userId) {
    try {
      setLoading(true);
      const followings = await userFunctions.getFollowings(userId);
      dispatch(userActions.setSpecificUsersFollowings(followings));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        {specificUser && (
          <>
            <ProfileHeader
              setLoading={setLoading}
              handleItemClick={handleItemClick}
              activeItem={activeItem}
              totalTweetCount={totalTweetCount}
            />
            <ProfileMenu
              setLoading={setLoading}
              handleItemClick={handleItemClick}
              activeItem={activeItem}
            />
          </>
        )}

        <Loader size="small" active={loading} />

        {/* 팔로워 */}

        {/* 팔로잉 */}

        {/* 트윗들  */}

        {/* 댓글들 */}

        {/* 미더어 트윗들 */}

        {/* 좋아요 누른 트윗들 */}
      </Grid.Column>
    </Grid>
  );
}

export default Profile;
