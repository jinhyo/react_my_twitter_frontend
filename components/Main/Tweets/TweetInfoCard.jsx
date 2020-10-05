import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import TweetCard from "./TweetCard";
import { Button } from "semantic-ui-react";
import PureRetweetCard from "./PureRetweetCard";
import { userSelector } from "../../../features/userSlice";

// in <TweetStatus />
function TweetInfoCard({ tweet }) {
  const favoriteTweets = useSelector(userSelector.favoriteTweets);
  const myTweets = useSelector(userSelector.myTweets);

  // 내가 좋아요 눌렀는지 확인
  const isFavoriteTweet = useCallback(
    tweetId => {
      const index = favoriteTweets.findIndex(tweet => tweet.id === tweetId);

      return index !== -1;
    },
    [favoriteTweets]
  );

  //// 리트윗인지 확인
  function isRewteet(tweet) {
    return tweet.retweetOriginId;
  }

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
    <div>
      <TweetCard
        tweet={tweet}
        favoriteStatus={isFavoriteTweet(tweet.id)}
        commentStatus={didIComment(tweet.id)}
      />

      <div className="ui four buttons">
        <Button basic color="green">
          <p>댓글</p>
          <p>3</p>
        </Button>
        <Button basic color="green">
          <p>리트윗</p>
          <p>8</p>
        </Button>
        <Button basic color="green">
          <p>인용한 트윗</p>
          <p>3</p>
        </Button>
        <Button basic color="green">
          <p>좋아요</p>
          <p>5</p>
        </Button>
      </div>
    </div>
  );
}

export default TweetInfoCard;
