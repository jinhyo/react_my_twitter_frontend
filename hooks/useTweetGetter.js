import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tweetSelector, tweetActions } from "../features/tweetSlice";

// in <Index />, <TweetsWithHashtag />
function useTweetGetter(getTweetsFromDB, tagName = null) {
  const dispatch = useDispatch();

  const tweets = useSelector(tweetSelector.tweets);

  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [loadTweetLoading, setLoadTweetLoading] = useState(true);
  const [clear, setClear] = useState(null);

  console.log("hasMorePosts", hasMorePosts);
  console.log("tweets", tweets);

  useEffect(() => {
    window.addEventListener("scroll", getMoreTweets);
    return () => {
      window.removeEventListener("scroll", getMoreTweets);
    };
  }, [tweets, loadTweetLoading, hasMorePosts]);

  useEffect(() => {
    return () => {
      clearTimeout(clear);
    };
  }, [clear]);

  /*  스크롤이 최하단에 가까워지면 트윗들을 추가로 가져옴 */
  async function getMoreTweets() {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePosts && !loadTweetLoading) {
        const lastId = tweets[tweets.length - 1]?.id;
        await getTweets(lastId);
      }
    }
  }

  function setTweetLoading() {
    setLoadTweetLoading(true);
    const clear = setTimeout(() => {
      setLoadTweetLoading(false);
    }, 3000);

    setClear(clear);
  }

  async function getTweets(lastId = null) {
    try {
      setTweetLoading();
      let tweets = [];
      tweets = await getTweetsFromDB(lastId, tagName);

      setHasMorePosts(tweets.length === 10);
      dispatch(tweetActions.setTweets(tweets));
    } catch (error) {
      console.error(error);
    }
  }

  return {
    tweets,
    getTweets
  };
}

export default useTweetGetter;
