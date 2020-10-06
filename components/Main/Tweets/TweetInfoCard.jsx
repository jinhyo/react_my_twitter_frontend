import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import TweetCard from "./TweetCard";
import { Button, Menu, Label } from "semantic-ui-react";
import PureRetweetCard from "./PureRetweetCard";
import { userSelector } from "../../../features/userSlice";

// in <TweetStatus />
function TweetInfoCard({ tweet }) {
  const favoriteTweets = useSelector(userSelector.favoriteTweets);
  const myTweets = useSelector(userSelector.myTweets);

  const [activeItem, setActiveItem] = useState("comment");

  const handleItemClick = useCallback((e, { name }) => {
    setActiveItem(name);
  }, []);

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
          name="comment"
          active={activeItem === "comment"}
          onClick={handleItemClick}
        >
          댓글
          <Label basic color="teal" content={tweet.comments.length} />
        </Menu.Item>
        <Menu.Item
          name="retweet"
          active={activeItem === "retweet"}
          onClick={handleItemClick}
        >
          리트윗
          <Label basic color="teal" content={tweet.retweets.length} />
        </Menu.Item>
        <Menu.Item
          name="quotation"
          active={activeItem === "quotation"}
          onClick={handleItemClick}
        >
          인용한 트윗
          <Label basic color="teal" content={tweet.quotations.length} />
        </Menu.Item>
        <Menu.Item
          name="friends"
          active={activeItem === "friends"}
          onClick={handleItemClick}
        >
          좋아요
          <Label basic color="teal" content={tweet.likers.length} />
        </Menu.Item>
      </Menu>
    </>
  );
}

export default TweetInfoCard;
