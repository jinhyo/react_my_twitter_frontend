import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Popup } from "semantic-ui-react";

import tweetFunctions from "../../../lib/tweetFunctions";
import { tweetActions } from "../../../features/tweetSlice";
import { userSelector, userActions } from "../../../features/userSlice";
import QuotedTweetModal from "./QuotedTweetModal";
import {
  specificUserActions,
  specificUserSelector
} from "../../../features/specificUserSlice";
import {
  specificTweetSelector,
  specificTweetActions
} from "../../../features/specificTweetSlice";

// in <TweetCard />, <PureRetweetCard />
function RetweetButton({ tweet, cancelPopup }) {
  const dispatch = useDispatch();

  const currentUserId = useSelector(userSelector.currentUserId);
  const myRetweets = useSelector(userSelector.myRetweets);
  const specificUserId = useSelector(specificUserSelector.userId);
  const specificTweetId = useSelector(specificTweetSelector.specificTweetId);
  const userCardInfo = useSelector(userSelector.userCardInfo);
  const nowWhere = useSelector(userSelector.nowWhere);

  const [modal, setModal] = useState(false);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

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
    if (!currentUserId) {
      cancelPopup();
      return alert("로그인이 필요합니다.");
    }
    try {
      const newTweet = await tweetFunctions.retweet(
        tweet.retweetOriginId || tweet.id // 원본을 리트윗 || 리트윗한 트윗을 리트윗
      );

      if (specificUserId) {
        // specificUser에게 적용
        dispatch(
          specificUserActions.increaseRetweetCount(
            tweet.retweetOriginId || tweet.id
          )
        );
        dispatch(specificUserActions.addTweet(newTweet));
      } else {
        // currentUser에게 적용
        dispatch(
          tweetActions.increaseRetweetCount(tweet.retweetOriginId || tweet.id)
        );

        if (specificTweetId === tweet.id) {
          // 트윗 상세보기에 적용
          dispatch(
            specificTweetActions.addRetweet({
              retweetId: newTweet.id,
              userInfo: userCardInfo
            })
          );
        } else if (nowWhere === "main") {
          // 메인에 트윗 추가
          dispatch(tweetActions.addTweet(newTweet));
        }
      }

      dispatch(userActions.addRetweetToMe(tweet.retweetOriginId || tweet.id));
      dispatch(
        userActions.addMyTweet({
          tweetId: newTweet.id,
          retweetOriginId: tweet.retweetOriginId || tweet.id,
          quotedOriginId: null,
          commentedOriginId: null
        })
      );

      cancelPopup();
    } catch (error) {
      console.error(error);
    }
  }, [tweet]);

  //// 리트윗 취소
  const handleCancelRetweet = useCallback(async () => {
    try {
      const retweetOriginId = selectRetweetOriginId(tweet);
      const deletedTweetId = await tweetFunctions.cancelRetweet(
        retweetOriginId
      );

      if (specificUserId) {
        // specificUser에게 적용
        dispatch(
          specificUserActions.decreaseRetweetCount(
            tweet.retweetOriginId || tweet.id
          )
        );
        dispatch(specificUserActions.cancelRetweet(tweet.id));
      } else {
        // currentUser에게 적용

        if (specificTweetId === tweet.id) {
          // 트윗 상세보기에 적용
          dispatch(
            specificTweetActions.removeRetweet({
              retweetId: deletedTweetId,
              userId: userCardInfo.id
            })
          );
        } else if (!specificTweetId) {
          dispatch(
            tweetActions.decreaseRetweetCount(tweet.retweetOriginId || tweet.id)
          );
          dispatch(tweetActions.removeTweet(deletedTweetId));
        }
      }

      dispatch(userActions.removeRtweetFromMe(retweetOriginId));
      dispatch(userActions.removeMyTweet([deletedTweetId]));

      cancelPopup();
    } catch (error) {
      console.error(error);
    }
  }, [tweet]);

  //// 현재 트윗이 리트윗된 원본인지, 리트윗한 트윗인지 확인 후 원본 트윗 아이디 반환
  function selectRetweetOriginId(currentTweet) {
    if (currentTweet.retweetOriginId) {
      // 리트윗한 트윗
      return currentTweet.retweetOriginId;
    } else {
      // 리트윗된 원본 트윗
      return currentTweet.id;
    }
  }

  const handleOpenModal = useCallback(() => {
    cancelPopup();
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }
    openModal();
  }, []);

  return (
    <>
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
        <Button
          basic
          size="medium"
          content="트윗 인용하기"
          fluid
          onClick={handleOpenModal}
        />
      </Popup>
      <QuotedTweetModal modal={modal} closeModal={closeModal} tweet={tweet} />
    </>
  );
}

export default RetweetButton;
