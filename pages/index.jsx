import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import axios from "axios";

import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import TweetForm from "../components/Main/Tweets/TweetForm";
import { userSelector, userActions } from "../features/userSlice";
import tweetFunctions from "../lib/tweetFunctions";
import authFunctions from "../lib/authFunctions";
import ShowTweets from "../components/Main/Tweets/ShowTweets";
import useTweetGetter from "../hooks/useTweetGetter";
import wrapper from "../store/configureStore";
import { tweetActions } from "../features/tweetSlice";

function Index() {
  const dispatch = useDispatch();

  const currentUser = useSelector(userSelector.currentUser);
  const nowWhere = useSelector(userSelector.nowWhere);

  const { tweets, getTweets } = useTweetGetter(tweetFunctions.getTweets);

  useEffect(() => {
    if (nowWhere === "main") {
      getTweets();
    }

    return () => {
      dispatch(tweetActions.clearTweets());
    };
  }, [nowWhere]);

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        {currentUser && <TweetForm />}
        <Divider />

        {/* 트윗들 랜더링 */}
        <ShowTweets tweets={tweets} />
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
      // 서버일 떄와 쿠키가 있을 경우
      axios.defaults.headers.Cookie = cookie; // 로그인 정보가 백엔드 서버로 넘어감
    }

    try {
      store.dispatch(userActions.setNowWhere("main"));
      const user = await authFunctions.getLoginUserInfo();
      store.dispatch(userActions.setCurrentUser(user));
    } catch (error) {
      console.error(error);
    }
  }
);

export default Index;
