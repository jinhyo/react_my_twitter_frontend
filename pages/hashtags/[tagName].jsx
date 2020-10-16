import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider, Message } from "semantic-ui-react";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import hashtagFunctions from "../../lib/hashtagFunctions";
import { tweetActions } from "../../features/tweetSlice";
import { userSelector, userActions } from "../../features/userSlice";
import { useRouter } from "next/router";
import useTweetGetter from "../../hooks/useTweetGetter";
import { searchActions } from "../../features/searchSlice";
import wrapper from "../../store/configureStore";
import axios from "axios";
import authFunctions from "../../lib/authFunctions";

function TweetsWithHashtag() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tagName } = router.query;
  console.log("tagName", tagName);

  const currentUser = useSelector(userSelector.currentUser);

  console.log("currentUser", currentUser);

  const { tweets, getTweets, errorMessage, setErrorMessage } = useTweetGetter(
    hashtagFunctions.getTweetsWithHashtag,
    tagName
  );

  useEffect(() => {
    if (tagName) {
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("hashtag"));

      getTweets();
    }

    return () => {
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("main"));
      dispatch(searchActions.setSearchWord(""));
      dispatch(searchActions.setSearchResults(null));

      setErrorMessage("");
    };
  }, [tagName]);

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        {/* 트윗들 랜더링 */}
        <ShowTweets tweets={tweets} />

        {/* 해당 해시태그가 없을 경우 */}
        {errorMessage && <Message size="huge" error header={errorMessage} />}
      </Grid.Column>
    </Grid>
  );
}

/* 서버사이드 렌더링 */
export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, req }) => {
    // 프론트 서버에서 백엔드에 쿠키 전달
    const cookie = req ? req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (req && cookie) {
      // if - 서버일 떄와 쿠키가 있을 경우
      axios.defaults.headers.Cookie = cookie; // 로그인 정보가 백엔드 서버로 넘어감
    }

    try {
      const user = await authFunctions.getLoginUserInfo();
      console.log("~~~getServerSideProps", user);
      store.dispatch(userActions.setCurrentUser(user));
    } catch (error) {
      console.error(error);
    }
  }
);

export default TweetsWithHashtag;
