import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Grid } from "semantic-ui-react";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import Trends from "../../components/LeftSide/Trends/Trends";

function Hashtags(props) {
  const { tagName } = router.query;
  const router = useRouter();
  const dispatch = useDispatch();

  const [loadTweetLoading, setLoadTweetLoading] = useState(true);

  useEffect(() => {
    if (tweetId) {
      dispatch(tweetActions.clearTweets());
      getTweetStatus(tweetId);
    }

    return () => {
      // <Index />에서 다시 트윗들을 가져오기 위해; <Index />의 useEffect[specificTweetId]을 콜
      dispatch(specificTweetActions.clearTweet());
      dispatch(specificTweetActions.setCurrentMenuItem(null));
      dispatch(tweetActions.clearTweets());
    };
  }, [tagName]);

  async function getHashtagTweets(lastId = null) {
    try {
      setTweetLoading();
      const newTweets = await tweetFunctions.getTweets(lastId);
      setHasMorePosts(newTweets.length === 10);
      dispatch(tweetActions.setTweets(newTweets));
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
      <Grid.Column tablet={10} computer={10}></Grid.Column>
    </Grid>
  );
}

export default Hashtags;
