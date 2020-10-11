import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label, Menu } from "semantic-ui-react";
import { specificTweetActions } from "../../../features/specificTweetSlice";
import tweetFunctions from "../../../lib/tweetFunctions";
import { tweetActions } from "../../../features/tweetSlice";
import userFunctions from "../../../lib/userFunctions";

function TweetInfoMenu({ activeItem, setActiveItem, setLoading, tweet }) {
  const dispatch = useDispatch();

  useEffect(() => {
    getComments(tweet.id);
  }, [tweet.id]);

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "comments") {
        dispatch(tweetActions.clearTweets());
        getComments(tweet.id);
      } else if (name === "retweetUsers") {
        getRetweetUsers(tweet.id);
      } else if (name === "quotations") {
        dispatch(tweetActions.clearTweets());
        getQuotaions(tweet.id);
      } else if (name === "likers") {
        getLikers(tweet.id);
      }
    },
    [tweet]
  );

  async function getComments(tweetId) {
    try {
      setLoading(true);
      const commentTweets = await tweetFunctions.getComments(tweetId);

      dispatch(tweetActions.setTweets(commentTweets));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getRetweetUsers(tweetId) {
    try {
      setLoading(true);
      const users = await userFunctions.getRetweetUsers(tweetId);

      dispatch(specificTweetActions.setRetweetUsers(users));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getLikers(tweetId) {
    try {
      setLoading(true);
      const users = await userFunctions.getLikers(tweetId);

      dispatch(specificTweetActions.setLikers(users));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getQuotaions(tweetId) {
    try {
      setLoading(true);
      const quotationTweets = await tweetFunctions.getQuotations(tweetId);

      dispatch(tweetActions.setTweets(quotationTweets));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Menu pointing widths={4}>
      <Menu.Item
        name="comments"
        active={activeItem === "comments"}
        onClick={handleItemClick}
      >
        댓글
        <Label size="mini" basic color="teal" content={tweet.comments.length} />
      </Menu.Item>
      <Menu.Item
        name="retweetUsers"
        active={activeItem === "retweetUsers"}
        onClick={handleItemClick}
      >
        리트윗
        <Label size="mini" basic color="teal" content={tweet.retweets.length} />
      </Menu.Item>
      <Menu.Item
        name="quotations"
        active={activeItem === "quotations"}
        onClick={handleItemClick}
      >
        인용한 트윗
        <Label
          size="mini"
          basic
          color="teal"
          content={tweet.quotations.length}
        />
      </Menu.Item>
      <Menu.Item
        name="likers"
        active={activeItem === "likers"}
        onClick={handleItemClick}
      >
        좋아요
        <Label size="mini" basic color="teal" content={tweet.likers.length} />
      </Menu.Item>
    </Menu>
  );
}

export default TweetInfoMenu;
