import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "../../../features/userSlice";
import PureRetweetCard from "./PureRetweetCard";
import TweetCard from "./TweetCard";

// in <TweetInfoCard />, <Index />, <Profile />
function ShowTweets({ tweets, inProfile }) {
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
    <>
      {tweets.map(tweet =>
        isRewteet(tweet) ? (
          <PureRetweetCard
            key={tweet.id}
            tweet={tweet}
            retweet={tweet.retweetOrigin}
            favoriteStatus={isFavoriteTweet(tweet.retweetOriginId)}
            commentStatus={didIComment(tweet.retweetOriginId)}
            inProfile={inProfile}
          />
        ) : (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            favoriteStatus={isFavoriteTweet(tweet.id)}
            commentStatus={didIComment(tweet.id)}
            inProfile={inProfile}
          />
        )
      )}
    </>
  );
}

export default ShowTweets;
