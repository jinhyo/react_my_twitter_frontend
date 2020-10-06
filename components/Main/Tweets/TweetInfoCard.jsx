import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import TweetCard from "./TweetCard";
import { Button, Menu, Label } from "semantic-ui-react";
import PureRetweetCard from "./PureRetweetCard";
import { userSelector } from "../../../features/userSlice";
import userFunctions from "../../../lib/userFunctions";

// in <TweetStatus />
function TweetInfoCard({ tweet }) {
  const favoriteTweets = useSelector(userSelector.favoriteTweets);
  const myTweets = useSelector(userSelector.myTweets);

  const [activeItem, setActiveItem] = useState("comments");
  const [retweetUsers, setRetweetUsers] = useState([]);
  const [likers, setLikers] = useState([]);
  const [quotaions, setQuotaions] = useState([]);
  const [comments, setComments] = useState([]);

  console.log("retweetUsers", retweetUsers);

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "comments") {
      } else if (name === "retweets") {
        try {
          const users = await userFunctions.getRetweetUsers(tweet.id);
          setRetweetUsers(users);
        } catch (error) {
          console.error(error.response.message || error);
        }
      } else if (name === "quotations") {
      } else if (name === "likers") {
      }
    },
    [tweet]
  );

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
      <TweetCard
        tweet={tweet}
        favoriteStatus={isFavoriteTweet(tweet.id)}
        commentStatus={didIComment(tweet.id)}
      />

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
          name="retweets"
          active={activeItem === "retweets"}
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

      {/* 댓글 트윗들 */}

      {/* 리트윗한 유저들 */}

      {/* 인용한 트윗들 */}

      {/* 좋아요 누른 유저들 */}
    </>
  );
}

export default TweetInfoCard;
