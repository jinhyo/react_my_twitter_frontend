import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Loader, Message } from "semantic-ui-react";
import axios from "axios";
import { useRouter } from "next/router";

import wrapper from "../../store/configureStore";
import Trends from "../../components/LeftSide/Trends/Trends";
import ProfileHeader from "../../components/Main/Users/ProfileHeader";
import userFunctions from "../../lib/userFunctions";
import ProfileMenu from "../../components/Main/Users/ProfileMenu";
import { userSelector, userActions } from "../../features/userSlice";
import UserCard from "../../components/Main/Users/UserCard";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import {
  specificUserSelector,
  specificUserActions,
} from "../../features/specificUserSlice";
import { searchActions } from "../../features/searchSlice";
import authFunctions from "../../lib/authFunctions";
import HtmlHead from "../../components/Layout/HtmlHead";
import { FRONTEND_URL } from "../../lib/constValue";

function Profile({ error }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { nickname } = router.query;

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
  console.log("activeItem", activeItem);
  useEffect(() => {
    return () => {
      // setErrorMessage("");

      dispatch(specificUserActions.clearUserInfos());
      dispatch(specificUserActions.clearCounts());
      dispatch(searchActions.setSearchWord(""));
      dispatch(searchActions.setSearchResults(null));
    };
  }, [nickname]);

  useEffect(() => {
    setActiveItem("tweets");
  }, []);

  useEffect(() => {
    if (specificUser) {
      getTweets(specificUser.id);
    }
  }, [specificUser]);

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);
      if (specificUser) {
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
    <>
      {specificUser && (
        <HtmlHead
          title={`'${specificUser.nickname}'님 상세정보`}
          description={`'${specificUser.nickname}'님 상세정보`}
          image={specificUser.avatarURL}
          url={`${FRONTEND_URL}/users/${nickname}`}
        />
      )}

      <Grid stackable padded relaxed>
        <Grid.Column tablet={6} computer={6}>
          {currentUser && currentUser?.id !== specificUser?.id && (
            <ProfileCard currentUser={currentUser} />
          )}

          <Trends />
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
            specificUsersFollowers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}

          {/* 팔로잉 */}
          {activeItem === "followings" &&
            specificUsersFollowings.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}

          {/* 트윗들  */}
          {activeItem === "tweets" && (
            <ShowTweets tweets={specificUsersTweets} />
          )}

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

          {/* 해당 유저가 없을 경우 */}
          {error && <Message size="huge" error header={error} />}

          <Loader size="small" active={loading} />
        </Grid.Column>
      </Grid>
    </>
  );
}

/* 서버사이드 렌더링 */
export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, req, query }) => {
    // 프론트 서버에서 백엔드에 쿠키 전달
    const cookie = req ? req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (req && cookie) {
      // 서버일 떄와 쿠키가 있을 경우
      axios.defaults.headers.Cookie = cookie; // 로그인 정보가 백엔드 서버로 넘어감
    }

    const { nickname } = query;

    try {
      const user = await authFunctions.getLoginUserInfo();
      const specificUser = await userFunctions.getSpecificUser(
        encodeURIComponent(nickname)
      );

      store.dispatch(userActions.setCurrentUser(user));
      store.dispatch(specificUserActions.setUser(specificUser));
      store.dispatch(
        specificUserActions.changeTotalTweetCount(specificUser.tweets.length)
      );
    } catch (error) {
      console.error(error);
      return { props: { error: error.response.data || error } };
    }
  }
);

export default Profile;
