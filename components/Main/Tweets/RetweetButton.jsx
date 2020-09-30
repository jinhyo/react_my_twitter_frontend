import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Popup } from "semantic-ui-react";
import tweetFunctions from "../../../lib/tweetFunctions";
import { tweetActions } from "../../../features/tweetSlice";
import { userSelector, userActions } from "../../../features/userSlice";

// in <TweetCard />
function RetweetButton({ tweet, cancelPopup }) {
  const dispatch = useDispatch();

  const myRetweets = useSelector(userSelector.myRetweets);
  console.log("myRetweets", myRetweets);

  //// 내가 리트윗 했는지 확인
  const didIRetweet = useCallback(() => {
    // 리트윗된 원본 트윗인지 확인
    const index = myRetweets.findIndex(retweet => retweet.id === tweet.id);

    // 리트윗한 트윗인지 확인
    const index2 = myRetweets.findIndex(
      retweet => retweet.id === tweet.retweetOriginId
    );

    return index !== -1 || index2 !== -1;
  }, [myRetweets]);

  //// 리트윗
  const handleRetweet = useCallback(async () => {
    try {
      const newTweet = await tweetFunctions.retweet(tweet.id);

      dispatch(tweetActions.addTweet(newTweet));
      dispatch(tweetActions.increaseRetweetCount(tweet.id));
      dispatch(userActions.addRetweetToMe(tweet.id));

      cancelPopup();
    } catch (error) {
      console.error(error.response.data || error);
    }
  }, [tweet]);

  //// 리트윗 취소
  const handleCancelRetweet = useCallback(async () => {
    try {
      const retweetOriginId = selectRetweetOriginId(tweet);
      const deletedTweetId = await tweetFunctions.cancelRetweet(
        retweetOriginId
      );

      dispatch(tweetActions.removeTweet(deletedTweetId));
      dispatch(tweetActions.decreaseRetweetCount(retweetOriginId));
      dispatch(userActions.removeRtweetFromMe(retweetOriginId));

      cancelPopup();
    } catch (error) {
      console.error(error.response.data || error);
    }
  }, [tweet]);

  //// 현재 트윗이 리트윗된 원본인지 리트윗한 트윗인지 확인 후 원본 트윗 아이디 반환
  function selectRetweetOriginId(currentTweet) {
    if (currentTweet.retweetOriginId) {
      // 리트윗한 트윗
      return currentTweet.retweetOriginId;
    } else {
      // 리트윗된 원본 트윗
      return currentTweet.id;
    }
  }
  return (
    <Popup
      wide
      trigger={
        <Button basic color="green">
          <Icon name="retweet" color={didIRetweet() ? "green" : "grey"} />
          {tweet.retweetOriginId
            ? tweet.retweetOrigin.retweetedCount
            : tweet.retweetedCount}
        </Button>
      }
      on="click"
    >
      {didIRetweet() ? (
        <Button
          basic
          size="medium"
          content="리트윗 취소하기"
          fluid
          onClick={handleCancelRetweet}
        />
      ) : (
        <Button
          basic
          size="medium"
          content="리트윗"
          fluid
          onClick={handleRetweet}
        />
      )}

      <Button basic size="medium" content="트윗 인용하기" fluid />
    </Popup>
  );
}

export default RetweetButton;
