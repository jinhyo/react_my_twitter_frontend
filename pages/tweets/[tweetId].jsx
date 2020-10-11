import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Loader } from "semantic-ui-react";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import { userSelector } from "../../features/userSlice";
import { useRouter } from "next/router";
import tweetFunctions from "../../lib/tweetFunctions";
import { tweetSelector, tweetActions } from "../../features/tweetSlice";
import {
  specificTweetActions,
  specificTweetSelector
} from "../../features/specificTweetSlice";
import TweetInfoMenu from "../../components/Main/Tweets/TweetInfoMenu";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import UserCard from "../../components/Main/Users/UserCard";

function TweetStatus() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tweetId } = router.query;

  const tweets = useSelector(tweetSelector.tweets);
  const currentUser = useSelector(userSelector.currentUser);
  const specificTweet = useSelector(specificTweetSelector.specificTweet);
  const likersOrRetweeters = useSelector(
    specificTweetSelector.likersOrRetweeters
  );

  const [activeItem, setActiveItem] = useState("comments");
  const [loading, setLoading] = useState(false);

  console.log("~~~specificTweet", specificTweet);

  useEffect(() => {
    if (tweetId) {
      dispatch(tweetActions.clearTweets());
      getTweetStatus(tweetId);
    }

    return () => {
      // <Index />에서 다시 트윗들을 가져오기 위해; <Index />의 useEffect[specificTweetId]을 콜
      dispatch(specificTweetActions.clearTweet());
      dispatch(tweetActions.clearTweets());
    };
  }, [tweetId]);

  async function getTweetStatus(tweetId) {
    try {
      const tweet = await tweetFunctions.getTweetStatus(tweetId);
      dispatch(specificTweetActions.setTweet(tweet));
    } catch (error) {
      console.error(error.response.data || error);
    }
  }

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={5} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
        <WhoToFollow />
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
          !loading &&
          likersOrRetweeters.map(user => (
            <UserCard key={user.id} user={user} />
          ))}

        {/* 인용한 트윗들 */}
        {activeItem === "quotations" && <ShowTweets tweets={tweets} />}

        {/* 좋아요 누른 유저들 */}
        {activeItem === "likers" &&
          !loading &&
          likersOrRetweeters.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
      </Grid.Column>
    </Grid>
  );
}

export default TweetStatus;
