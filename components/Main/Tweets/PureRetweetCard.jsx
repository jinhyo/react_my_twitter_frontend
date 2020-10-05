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
import QuotedTweetCard from "./QuotedTweetCard";
import Link from "next/link";

// in <Index />
function PureRetweetCard({ tweet, retweet, favoriteStatus }) {
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
        await tweetFunctions.unlikeTweets(retweet.id);

        dispatch(
          tweetActions.unlikeTweet({ myId: currentUserId, tweetId: retweet.id })
        );
        dispatch(userActions.removeFavoriteTweetsFromMe(retweet.id));
      } catch (error) {
        console.error(error);
      }
    } else {
      // 좋아요 등록
      try {
        await tweetFunctions.likeTweets(retweet.id);

        dispatch(
          tweetActions.likeTweet({ myId: currentUserId, tweetId: retweet.id })
        );
        dispatch(userActions.addFavoriteTweetsToMe(retweet.id));
      } catch (error) {
        console.error(error);
      }
    }
  }, [favoriteStatus, currentUserId]);

  //// 누가 리트윗 했는지 표시
  const displayRetweetSign = useCallback(() => {
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
              <Link href={`/users/${retweet.user.id}`}>
                <a>
                  <Image
                    floated="left"
                    width={50}
                    height={50}
                    src={retweet.user.avatarURL}
                    className="picture__circle"
                  />
                </a>
              </Link>
              <Feed.Content>
                <Feed.Summary>
                  <Link href={`/users/${retweet.user.id}`}>
                    <a>@{retweet.user.nickname}</a>
                  </Link>
                  <Feed.Date>{moment(retweet.createdAt).fromNow()}</Feed.Date>

                  {/* 추가 드랍다운 메뉴 */}
                  {currentUserId && (
                    <ExtraDropdown
                      currentUserId={currentUserId}
                      writerNickname={retweet.user.nickname}
                      writerId={retweet.user.id}
                      tweetId={retweet.id}
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
          <TweetContents contents={retweet.contents} />
          {retweet.hasMedia && <TweetImages images={retweet.images} />}

          {/* 인용 트윗을 리트윗하는 경우 */}
          {retweet.quotedOriginId && (
            <QuotedTweetCard tweet={retweet.quotedOrigin} />
          )}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
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
          {retweet.likers.length}
        </Button>

        {/* 답글 버튼 */}
        <Button basic color="green">
          <Icon name="comment outline" color="grey" /> 0
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PureRetweetCard;
