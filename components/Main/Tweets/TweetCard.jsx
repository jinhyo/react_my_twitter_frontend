import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Icon, Feed, Image } from "semantic-ui-react";
import moment from "moment";
import TweetImages from "./TweetImages";
import TweetContents from "./TweetContents";
import tweetFunctions from "../../../lib/tweetFunctions";
import { userActions, userSelector } from "../../../features/userSlice";
import { tweetActions } from "../../../features/tweetSlice";
import ExtraDropdown from "./ExtraDropdown";
import RetweetButton from "./RetweetButton";
import QuotedTweetCard from "./QuotedTweetCard";

// in <Index />
function TweetCard({ tweet, favoriteStatus }) {
  const dispatch = useDispatch();
  const afterClickRef = useRef();

  const currentUserId = useSelector(userSelector.currentUserId);

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

  return (
    <Card fluid>
      <Card.Content style={{ paddingBottom: 0 }}>
        <Card.Header>
          <Feed>
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
                      tweet={tweet}
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

          {/* 인용 트윗인 경우 */}
          {tweet.quotedOriginId && (
            <QuotedTweetCard tweet={tweet.quotedOrigin} />
          )}
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
