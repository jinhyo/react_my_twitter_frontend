import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import TweetCard from "./TweetCard";
import {
  Button,
  Menu,
  Label,
  Comment,
  Divider,
  Loader,
  Dimmer
} from "semantic-ui-react";
import PureRetweetCard from "./PureRetweetCard";
import { userSelector } from "../../../features/userSlice";
import userFunctions from "../../../lib/userFunctions";
import UserCard from "../Users/UserCard";
import tweetFunctions from "../../../lib/tweetFunctions";

// in <TweetStatus />
function TweetInfoCard({ tweet }) {
  const favoriteTweets = useSelector(userSelector.favoriteTweets);
  const myTweets = useSelector(userSelector.myTweets);

  const [activeItem, setActiveItem] = useState("comments");
  const [loading, setLoading] = useState(false);
  const [retweetUsers, setRetweetUsers] = useState([]);
  const [likers, setLikers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [comments, setComments] = useState([]);

  console.log("retweetUsers", retweetUsers);
  console.log("likers", likers);
  console.log("quotations", quotations);

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "comments") {
      } else if (name === "retweetUsers") {
        await getRetweetUsers(tweet.id);
      } else if (name === "quotations") {
        await getQuotaions(tweet.id);
      } else if (name === "likers") {
        await getLikers(tweet.id);
      }
    },
    [tweet]
  );

  async function getRetweetUsers(tweetId) {
    try {
      setLoading(true);
      const users = await userFunctions.getRetweetUsers(tweetId);

      setRetweetUsers(users);
    } catch (error) {
      console.error(error.response.data || error);
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
      console.error(error.response.data || error);
    } finally {
      setLoading(false);
    }
  }

  async function getQuotaions(tweetId) {
    try {
      setLoading(true);
      const quotationTweets = await tweetFunctions.getQuotations(tweetId);
      console.log("quotationTweets", quotationTweets);

      setQuotations(quotationTweets);
    } catch (error) {
      console.error(error.response.data || error);
    } finally {
      setLoading(false);
    }
  }

  // 내가 좋아요 눌렀는지 확인
  const isFavoriteTweet = useCallback(
    tweetId => {
      const index = favoriteTweets.findIndex(tweet => tweet.id === tweetId);

      return index !== -1;
    },
    [favoriteTweets]
  );

  //// 내가 댓글을 달았는지 확인
  const didIComment = useCallback(
    currentTweetId => {
      const index = myTweets.findIndex(
        tweet => tweet.commentedOriginId === currentTweetId
      );

      return index !== -1;
    },
    [myTweets]
  );

  return (
    <>
      <TweetCard tweet={tweet} />

      <Menu pointing>
        <Menu.Item
          name="comments"
          active={activeItem === "comments"}
          onClick={handleItemClick}
        >
          댓글
          <Label basic color="teal" content={tweet.comments.length} />
        </Menu.Item>
        <Menu.Item
          name="retweetUsers"
          active={activeItem === "retweetUsers"}
          onClick={handleItemClick}
        >
          리트윗
          <Label basic color="teal" content={tweet.retweets.length} />
        </Menu.Item>
        <Menu.Item
          name="quotations"
          active={activeItem === "quotations"}
          onClick={handleItemClick}
        >
          인용한 트윗
          <Label basic color="teal" content={tweet.quotations.length} />
        </Menu.Item>
        <Menu.Item
          name="likers"
          active={activeItem === "likers"}
          onClick={handleItemClick}
        >
          좋아요
          <Label basic color="teal" content={tweet.likers.length} />
        </Menu.Item>
      </Menu>

      <Loader size="small" active={loading} />

      {/* 댓글 트윗들 */}

      {/* 리트윗한 유저들 */}
      {activeItem === "retweetUsers" &&
        retweetUsers.map(user => <UserCard key={user.id} user={user} />)}

      {/* 인용한 트윗들 */}
      {activeItem === "quotations" &&
        quotations.map(tweet => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            favoriteStatus={isFavoriteTweet(tweet.id)}
            commentStatus={didIComment(tweet.id)}
          />
        ))}

      {/* 좋아요 누른 유저들 */}
      {activeItem === "likers" &&
        likers.map(user => <UserCard key={user.id} user={user} />)}
    </>
  );
}

export default TweetInfoCard;
