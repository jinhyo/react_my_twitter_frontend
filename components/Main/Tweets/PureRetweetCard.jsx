import React, { useCallback, useRef, useState } from "react";
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
import {
  specificUserSelector,
  specificUserActions
} from "../../../features/specificUserSlice";
import TweetForm from "./TweetForm";

// in <ShowTweets />
function PureRetweetCard({ tweet, retweet, favoriteStatus, commentStatus }) {
  const dispatch = useDispatch();
  const afterClickRef = useRef();

  const currentUserId = useSelector(userSelector.currentUserId);
  const specificUserId = useSelector(specificUserSelector.userId);
  const myRetweets = useSelector(userSelector.myRetweets);

  const [commentInput, setCommentInput] = useState(false);

  //// 리트윗 popup 해제
  function cancelPopup() {
    if (afterClickRef.current) {
      afterClickRef.current.click();
    }
  }

  /*  좋아요 버튼 클릭(추가 & 삭제) */
  const handleClickLike = useCallback(async () => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    if (favoriteStatus) {
      // 좋아요 삭제
      try {
        await tweetFunctions.unlikeTweets(retweet.id);
      } catch (error) {
        console.error(error);
      }

      // redux state change
      if (specificUserId) {
        // specificUser에게 적용
        dispatch(
          specificUserActions.unlikeTweet({
            myId: currentUserId,
            tweetId: retweet.id
          })
        );
        dispatch(userActions.removeFavoriteTweetsFromMe(retweet.id));

        // 내가 내 프로필을 보고 있을 경우 프로필 화면의 좋아요 카운트 변경
        if (currentUserId === specificUserId) {
          dispatch(specificUserActions.changeFavoriteTweetCount(-1));
        }
      } else {
        // currentUser에게 적용
        dispatch(
          tweetActions.unlikeTweet({ myId: currentUserId, tweetId: retweet.id })
        );
        dispatch(userActions.removeFavoriteTweetsFromMe(retweet.id));
      }
    } else {
      // 좋아요 등록
      try {
        await tweetFunctions.likeTweets(retweet.id);
      } catch (error) {
        console.error(error);
      }

      // redux state change
      if (specificUserId) {
        // specificUser에게 적용
        dispatch(
          specificUserActions.likeTweet({
            myId: currentUserId,
            tweetId: retweet.id
          })
        );
        dispatch(userActions.addFavoriteTweetsToMe(retweet.id));

        // 내가 내 프로필을 보고 있을 경우 프로필 화면의 좋아요 카운트 변경
        if (currentUserId === specificUserId) {
          dispatch(specificUserActions.changeFavoriteTweetCount(1));
        }
      } else {
        // currentUser에게 적용
        dispatch(
          tweetActions.likeTweet({ myId: currentUserId, tweetId: retweet.id })
        );
        dispatch(userActions.addFavoriteTweetsToMe(retweet.id));
      }
    }
  }, [favoriteStatus, currentUserId, specificUserId]);

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

  const handleShowCommentInput = useCallback(() => {
    setCommentInput(prev => !prev);
  }, [commentInput]);

  // 댓글일 경우 표시
  const renderCommentStatus = useCallback(() => {
    if (tweet.commentedOriginId && !tweet.commentedOrigin) {
      return <Feed.Summary>댓글이 달린 트윗이 삭제되었습니다.</Feed.Summary>;
    } else if (tweet.commentedOriginId) {
      return (
        <Feed.Summary>
          <Link
            href={`/users/[userId]`}
            as={`/users/${tweet.commentedOrigin.user.id}`}
          >
            <a>@{tweet.commentedOrigin.user.nickname}</a>
          </Link>
          님의
          <Link
            href={`/tweets/[tweetId]`}
            as={`/tweets/${tweet.commentedOriginId}`}
          >
            <a>트윗</a>
          </Link>
          에 보내는 답글
        </Feed.Summary>
      );
    } else {
      return null;
    }
  }, [tweet]);

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Feed>
            {displayRetweetSign()}

            <Feed.Event>
              <Link href={`/users/[userId]`} as={`/users/${retweet.user.id}`}>
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
                  <Link
                    href={`/users/[userId]`}
                    as={`/users/${retweet.user.id}`}
                  >
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
                <p />

                {/* 답글일 경우 표시 */}
                {renderCommentStatus()}
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

        {/* 댓글 버튼 */}
        <Button basic color="green" onClick={handleShowCommentInput}>
          {commentStatus ? (
            <Icon name="comment" />
          ) : (
            <Icon name="comment outline" color="grey" />
          )}
          {retweet.comments.length}
        </Button>
        {commentInput && (
          <TweetForm
            commentedTweetId={retweet.id}
            setCommentInput={setCommentInput}
            currentRetweetId={tweet.id}
          />
        )}
      </Card.Content>
    </Card>
  );
}

export default PureRetweetCard;
