import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Loader, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import axios from "axios";

import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import { userSelector, userActions } from "../../features/userSlice";
import tweetFunctions from "../../lib/tweetFunctions";
import { tweetSelector, tweetActions } from "../../features/tweetSlice";
import {
  specificTweetActions,
  specificTweetSelector
} from "../../features/specificTweetSlice";
import TweetInfoMenu from "../../components/Main/Tweets/TweetInfoMenu";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import UserCard from "../../components/Main/Users/UserCard";
import { searchActions } from "../../features/searchSlice";
import wrapper from "../../store/configureStore";
import authFunctions from "../../lib/authFunctions";
import { FRONTEND_URL } from "../../lib/constValue";
import HtmlHead from "../../components/Layout/HtmlHead";

function TweetStatus({ error }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tweetId } = router.query;

  const tweets = useSelector(tweetSelector.tweets);
  const specificTweet = useSelector(specificTweetSelector.specificTweet);
  const currentUser = useSelector(userSelector.currentUser);
  const likers = useSelector(specificTweetSelector.likers);
  const retweetUsers = useSelector(specificTweetSelector.retweetUsers);

  const [activeItem, setActiveItem] = useState("comments");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error);

  useEffect(() => {
    if (tweetId) {
      dispatch(userActions.setNowWhere(''))
      dispatch(tweetActions.clearTweets());
    }

    return () => {
      // <Index />에서 다시 트윗들을 가져오기 위해; <Index />의 useEffect[specificTweetId]을 콜
      dispatch(specificTweetActions.clearTweet());
      dispatch(specificTweetActions.setCurrentMenuItem(null));
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("main"));
      dispatch(searchActions.setSearchWord(""));
      dispatch(searchActions.setSearchResults(null));

      setErrorMessage("");
    };
  }, [tweetId]);

  return (
    <>
      {specificTweet && (
        <HtmlHead
          title={`'${specificTweet.user.nickname}'님의 트윗`}
          description={specificTweet.contents}
          image={
            specificTweet.images[0]
              ? specificTweet.images[0].src
              : FRONTEND_URL + "/favicon.ico"
          }
          url={`${FRONTEND_URL}/tweets/${tweetId}`}
        />
      )}

      <Grid stackable padded relaxed>
        <Grid.Column tablet={5} computer={6}>
          {currentUser && <ProfileCard currentUser={currentUser} />}

          <Trends />
        </Grid.Column>
        <Grid.Column tablet={11} computer={10}>
          {/* 트윗 인포 */}
          {specificTweet && <ShowTweets tweets={[specificTweet]} />}

          {/* 트윗 인포 매뉴 */}
          {specificTweet && (
            <TweetInfoMenu
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              setLoading={setLoading}
              tweet={specificTweet}
            />
          )}

          {/* 로딩 */}
          <Loader size="small" active={loading} />

          {/* 댓글 트윗들 */}
          {activeItem === "comments" && <ShowTweets tweets={tweets} />}

          {/* 리트윗한 유저들 */}
          {activeItem === "retweetUsers" &&
            retweetUsers.map(user => <UserCard key={user.id} user={user} />)}

          {/* 인용한 트윗들 */}
          {activeItem === "quotations" && <ShowTweets tweets={tweets} />}

          {/* 좋아요 누른 유저들 */}
          {activeItem === "likers" &&
            likers.map(user => <UserCard key={user.id} user={user} />)}

          {/* 해당 트윗이 없을 경우 */}
          {errorMessage && <Message size="huge" error header={errorMessage} />}
        </Grid.Column>
      </Grid>
    </>
  );
}

/* 서버사이드 렌더링 */
export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, req, query }) => {
    //// 프론트 서버에서 백엔드에 쿠키 전달
    const cookie = req ? req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (req && cookie) {
      // 서버일 떄와 쿠키가 있을 경우에만 쿠키 세팅
      axios.defaults.headers.Cookie = cookie;
    }

    const { tweetId } = query;

    try {
      const specificTweet = await tweetFunctions.getTweetStatus(tweetId);
      const user = await authFunctions.getLoginUserInfo();
      store.dispatch(specificTweetActions.setTweet(specificTweet));
      store.dispatch(userActions.setCurrentUser(user));

      return { props: { specificTweet } };
    } catch (error) {
      console.error(error);

      return { props: { error: error.response.data || error } };
    }
  }
);

export default TweetStatus;
