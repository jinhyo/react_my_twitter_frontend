import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TweetCard from "./TweetCard";
import { Menu, Label, Loader } from "semantic-ui-react";
import userFunctions from "../../../lib/userFunctions";
import UserCard from "../Users/UserCard";
import tweetFunctions from "../../../lib/tweetFunctions";
import ShowTweets from "./ShowTweets";
import { tweetActions, tweetSelector } from "../../../features/tweetSlice";
import { specificTweetActions } from "../../../features/specificTweetSlice";

// in <TweetStatus />
function TweetInfoCard({ tweet }) {
  const dispatch = useDispatch();

  const tweets = useSelector(tweetSelector.tweets);

  const [activeItem, setActiveItem] = useState("comments");
  const [loading, setLoading] = useState(false);
  const [retweetUsers, setRetweetUsers] = useState([]);
  const [likers, setLikers] = useState([]);

  useEffect(() => {
    getComments(tweet.id);
  }, []);

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

      setRetweetUsers(users);
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
      setLikers(users);
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
    <>
      <TweetCard tweet={tweet} />

      {/* 트윗 인포 매뉴 */}
      <Menu pointing widths={4}>
        <Menu.Item
          name="comments"
          active={activeItem === "comments"}
          onClick={handleItemClick}
        >
          댓글
          <Label
            size="mini"
            basic
            color="teal"
            content={tweet.comments.length}
          />
        </Menu.Item>
        <Menu.Item
          name="retweetUsers"
          active={activeItem === "retweetUsers"}
          onClick={handleItemClick}
        >
          리트윗
          <Label
            size="mini"
            basic
            color="teal"
            content={tweet.retweets.length}
          />
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
    </>
  );
}

export default TweetInfoCard;
