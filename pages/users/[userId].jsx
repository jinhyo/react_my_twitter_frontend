import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Loader } from "semantic-ui-react";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import ProfileHeader from "../../components/Main/Users/ProfileHeader";
import { useRouter } from "next/router";
import userFunctions from "../../lib/userFunctions";
import ProfileMenu from "../../components/Main/Users/ProfileMenu";
import { userActions, userSelector } from "../../features/userSlice";
import UserCard from "../../components/Main/Users/UserCard";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import {
  specificUserSelector,
  specificUserActions
} from "../../features/specificUserSlice";
import { searchActions } from "../../features/searchSlice";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId } = router.query;

  const currentUser = useSelector(userSelector.currentUser);
  const specificUser = useSelector(specificUserSelector.user);
  const specificUsersFollowers = useSelector(specificUserSelector.followers);
  const specificUsersFollowings = useSelector(specificUserSelector.followings);
  const specificUsersTweets = useSelector(specificUserSelector.tweets);
  const specificUsersComments = useSelector(specificUserSelector.commentTweets);
  const specificUsersMediaTweets = useSelector(
    specificUserSelector.mediaTweets
  );
  const specificUsersFavorites = useSelector(
    specificUserSelector.favoriteTweets
  );

  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("tweets");

  console.log("specificUser", specificUser);

  useEffect(() => {
    if (userId) {
      getSpecificUser(userId);
      getTweets(userId);
      setActiveItem("tweets");
    }

    return () => {
      dispatch(specificUserActions.clearUserInfos());
      dispatch(specificUserActions.clearCounts());
    };
  }, [userId]);

  useEffect(() => {
    return () => {
      dispatch(searchActions.setSearchWord(""));
    };
  }, []);

  async function getSpecificUser(userId) {
    try {
      const user = await userFunctions.getSpecificUser(userId);
      dispatch(searchActions.setSearchWord("@" + user.nickname));
      dispatch(specificUserActions.setUser(user));
      dispatch(specificUserActions.changeTotalTweetCount(user.tweets.length));
    } catch (error) {
      console.error(error);
    }
  }

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "tweets") {
        getTweets(specificUser.id);
      } else if (name === "comments") {
        getComments(specificUser.id);
      } else if (name === "medias") {
        getMediaTweets(specificUser.id);
      } else if (name === "followers") {
        getFollowers(specificUser.id);
      } else if (name === "followings") {
        getFollowings(specificUser.id);
      } else if (name === "favoriteTweets") {
        getFavorites(specificUser.id);
      }
    },
    [specificUser]
  );

  async function getFollowers(userId) {
    try {
      setLoading(true);
      const followers = await userFunctions.getSpecificUsersFollowers(userId);
      dispatch(specificUserActions.setFollowers(followers));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getFollowings(userId) {
    try {
      setLoading(true);
      const followings = await userFunctions.getSpecificUsersFollowings(userId);
      dispatch(specificUserActions.setFollowings(followings));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getTweets(userId) {
    try {
      setLoading(true);
      const tweets = await userFunctions.getSpecificUsersTweets(userId);
      dispatch(specificUserActions.setTweets(tweets));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getComments(userId) {
    try {
      setLoading(true);
      const tweets = await userFunctions.getSpecificUsersComments(userId);
      dispatch(specificUserActions.setCommentTweets(tweets));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getMediaTweets(userId) {
    try {
      setLoading(true);
      const tweets = await userFunctions.getSpecificUsersMediaTweets(userId);
      dispatch(specificUserActions.setMediaTweets(tweets));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getFavorites(userId) {
    try {
      setLoading(true);
      const tweets = await userFunctions.getSpecificUsersFavorites(userId);
      dispatch(specificUserActions.setFavoriteTweets(tweets));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && currentUser?.id !== specificUser?.id && (
          <ProfileCard currentUser={currentUser} />
        )}

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
            />
            <ProfileMenu
              setLoading={setLoading}
              handleItemClick={handleItemClick}
              activeItem={activeItem}
            />
          </>
        )}

        {/* 팔로워 */}
        {activeItem === "followers" &&
          specificUsersFollowers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}

        {/* 팔로잉 */}
        {activeItem === "followings" &&
          specificUsersFollowings.map(user => (
            <UserCard key={user.id} user={user} />
          ))}

        {/* 트윗들  */}
        {activeItem === "tweets" && <ShowTweets tweets={specificUsersTweets} />}

        {/* 댓글들 */}
        {activeItem === "comments" && (
          <ShowTweets tweets={specificUsersComments} />
        )}

        {/* 미디어 트윗들 */}
        {activeItem === "medias" && (
          <ShowTweets tweets={specificUsersMediaTweets} />
        )}

        {/* 좋아요 누른 트윗들 */}
        {activeItem === "favoriteTweets" && (
          <ShowTweets tweets={specificUsersFavorites} />
        )}

        <Loader size="small" active={loading} />
      </Grid.Column>
    </Grid>
  );
}

export default Profile;
