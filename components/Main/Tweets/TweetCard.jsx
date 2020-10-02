import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Icon, Feed, Image, IconGroup } from "semantic-ui-react";
import moment from "moment";
import TweetImages from "./TweetImages";
import TweetContents from "./TweetContents";
import tweetFunctions from "../../../lib/tweetFunctions";
import { userActions, userSelector } from "../../../features/userSlice";
import { tweetActions } from "../../../features/tweetSlice";
import ExtraDropdown from "./ExtraDropdown";
import RetweetButton from "./RetweetButton";

// in <Index />
function TweetCard({ tweet, favoriteStatus }) {
  const dispatch = useDispatch();
  const afterClickRef = useRef();

  const currentUserId = useSelector(userSelector.currentUserId);
  const myRetweets = useSelector(userSelector.myRetweets);

  //// 리트윗 popup 해제
  function cancelPopup() {
    if (afterClickRef.current) {
      afterClickRef.current.click();
    }
  }

  //// 좋아요 버튼 클릭(추가 & 삭제)
  const handleClickLike = useCallback(async () => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    if (favoriteStatus) {
      // 좋아요 삭제
      try {
        await tweetFunctions.unlikeTweets(tweet.id);

        dispatch(
          tweetActions.unlikeTweet({ myId: currentUserId, tweetId: tweet.id })
        );
        dispatch(userActions.removeFavoriteTweetsFromMe(tweet.id));
      } catch (error) {
        console.error(error);
      }
    } else {
      // 좋아요 등록
      try {
        await tweetFunctions.likeTweets(tweet.id);

        dispatch(
          tweetActions.likeTweet({ myId: currentUserId, tweetId: tweet.id })
        );
        dispatch(userActions.addFavoriteTweetsToMe(tweet.id));
      } catch (error) {
        console.error(error);
      }
    }
  }, [favoriteStatus, currentUserId]);

  //// 누가 리트윗 했는지 표시
  const displayRetweetSign = useCallback(() => {
    if (tweet.retweetOriginId) {
      // 리트윗인된 트윗인 경우

      let retweetUser;
      if (isMyRetweet(currentUserId, tweet, myRetweets)) {
        // 내가 리트윗한 경우
        retweetUser = "내가";
      } else {
        retweetUser = `${tweet.user.nickname} 님이 `;
      }

      return (
        <span className="retweet__sign">
          <Icon name="retweet" /> {retweetUser} 리트윗함
        </span>
      );
    } else {
      return null;
    }
  }, [currentUserId, tweet, myRetweets]);

  //// 내가 리트윗 했는지 확인
  function isMyRetweet(currentUserId, tweet, myRetweets) {
    const index = myRetweets.findIndex(
      retweet => retweet.id === tweet.retweetOriginId
    );

    return currentUserId === tweet.user.id && index !== -1;
  }

  return (
    <Card fluid>
      <Card.Content style={{ paddingBottom: 0 }}>
        <Card.Header>
          <Feed>
            {displayRetweetSign()}
            <Feed.Event>
              <Image
                floated="left"
                width={50}
                height={50}
                src={tweet.user.avatarURL}
                className="picture__circle"
              />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>@{tweet.user.nickname}</Feed.User>
                  <Feed.Date>{moment(tweet.createdAt).fromNow()}</Feed.Date>

                  {/* 추가 드랍다운 메뉴 */}
                  {currentUserId && (
                    <ExtraDropdown
                      currentUserId={currentUserId}
                      writerNickname={tweet.user.nickname}
                      writerId={tweet.user.id}
                      tweetId={tweet.id}
                    />
                  )}
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Card.Description>
          <TweetContents contents={tweet.contents} />
          {tweet.hasMedia && <TweetImages images={tweet.images} />}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {/* 답글 버튼 */}
        <Button basic color="green">
          <Icon name="comment outline" color="grey" /> 0
        </Button>

        {/* 리트윗 버튼 */}
        <RetweetButton tweet={tweet} cancelPopup={cancelPopup} />
        <span ref={afterClickRef}></span>

        {/* 좋아요 버튼 */}
        <Button basic color="green" onClick={handleClickLike}>
          {favoriteStatus ? (
            <Icon name="heart" color="red" />
          ) : (
            <Icon name="heart outline" color="grey" />
          )}
          {tweet.likers.length}
        </Button>
      </Card.Content>
    </Card>
  );
}

export default TweetCard;
