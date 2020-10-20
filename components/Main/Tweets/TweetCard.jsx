import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Icon, Feed, Image } from "semantic-ui-react";
import moment from "moment";
import Link from "next/link";

import TweetImages from "./TweetImages";
import TweetContents from "./TweetContents";
import tweetFunctions from "../../../lib/tweetFunctions";
import { userActions, userSelector } from "../../../features/userSlice";
import { tweetActions } from "../../../features/tweetSlice";
import ExtraDropdown from "./ExtraDropdown";
import RetweetButton from "./RetweetButton";
import QuotedTweetCard from "./QuotedTweetCard";
import TweetForm from "./TweetForm";
import {
  specificUserActions,
  specificUserSelector
} from "../../../features/specificUserSlice";
import {
  specificTweetActions,
  specificTweetSelector
} from "../../../features/specificTweetSlice";

// in <ShowTweets />
function TweetCard({ tweet, favoriteStatus, commentStatus }) {
  const dispatch = useDispatch();
  const afterClickRef = useRef();

  const currentUserId = useSelector(userSelector.currentUserId);
  const specificUserId = useSelector(specificUserSelector.userId);
  const userCardInfo = useSelector(userSelector.userCardInfo);
  const specificTweetId = useSelector(specificTweetSelector.specificTweetId);

  const [commentInput, setCommentInput] = useState(false);

  /*  리트윗 popup 해제 */
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
        await tweetFunctions.unlikeTweets(tweet.id);
      } catch (error) {
        console.error(error);
      }

      dispatch(userActions.removeFavoriteTweetsFromMe(tweet.id));

      if (specificUserId) {
        // specificUser에게 적용
        dispatch(
          specificUserActions.unlikeTweet({
            myId: currentUserId,
            tweetId: tweet.id
          })
        );

        // 내가 내 프로필을 보고 있을 경우 프로필 화면의 좋아요 카운트 변경 & 좋아요 트윗 추가
        if (currentUserId === specificUserId) {
          dispatch(specificUserActions.changeFavoriteTweetCount(-1));
          dispatch(specificUserActions.removeFavoriteTweet(tweet.id));
        }
      } else {
        // currentUser에게 적용
        dispatch(
          tweetActions.unlikeTweet({ myId: currentUserId, tweetId: tweet.id })
        );
      }

      if (specificTweetId === tweet.id) {
        // 트윗 상세보기에 적용
        dispatch(specificTweetActions.removeLiker(currentUserId));
      }
    } else {
      // 좋아요 등록
      try {
        await tweetFunctions.likeTweets(tweet.id);
      } catch (error) {
        console.error(error);
      }

      dispatch(userActions.addFavoriteTweetsToMe(tweet.id));

      if (specificUserId) {
        // specificUser에게 적용
        dispatch(
          specificUserActions.likeTweet({
            myId: currentUserId,
            tweetId: tweet.id
          })
        );

        // 내가 내 프로필을 보고 있을 경우 프로필 화면의 좋아요 카운트 변경
        if (currentUserId === specificUserId) {
          dispatch(specificUserActions.changeFavoriteTweetCount(1));
        }
      } else {
        // currentUser에게 적용
        dispatch(
          tweetActions.likeTweet({ myId: currentUserId, tweetId: tweet.id })
        );
      }

      if (specificTweetId === tweet.id) {
        // 트윗 상세보기에 적용
        dispatch(specificTweetActions.addLiker(userCardInfo));
      }
    }
  }, [favoriteStatus, currentUserId, specificUserId]);

  const handleShowCommentInput = useCallback(() => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    setCommentInput(prev => !prev);
  }, [commentInput]);

  /*  댓글일 경우 표시 */
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
          에 보내는 댓글
        </Feed.Summary>
      );
    } else {
      return null;
    }
  }, [tweet]);

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Feed>
              <Feed.Event>
                <Link href={`/users/[userId]`} as={`/users/${tweet.user.id}`}>
                  <a>
                    <Image
                      floated="left"
                      width={50}
                      height={50}
                      src={tweet.user.avatarURL.replace("/images/", "/thumb/")}
                      className="picture__circle"
                    />
                  </a>
                </Link>
                <Feed.Content>
                  <Feed.Summary>
                    <Link
                      href={`/users/[userId]`}
                      as={`/users/${tweet.user.id}`}
                    >
                      <a>@{tweet.user.nickname}</a>
                    </Link>
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
            {/* 트윗 내용 */}
            <TweetContents contents={tweet.contents} />

            {/* 트윗 이미지 */}
            {tweet.hasMedia && <TweetImages images={tweet.images} />}

            {/* 인용 트윗인 경우 */}
            {tweet.quotedOriginId && (
              <QuotedTweetCard tweet={tweet.quotedOrigin} />
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
            {tweet.likers.length}
          </Button>

          {/* 댓글 버튼 */}
          <Button basic color="green" onClick={handleShowCommentInput}>
            {commentStatus ? (
              <Icon name="comment" />
            ) : (
              <Icon name="comment outline" color="grey" />
            )}
            {tweet.comments.length}
          </Button>

          {/* 댓글 보기 버튼 */}
          {tweet.comments.length > 0 && (
            <Link href={`/tweets/[tweetId]`} as={`/tweets/${tweet.id}`}>
              <a className="item"> &nbsp; 댓글 보기</a>
            </Link>
          )}
        </Card.Content>
      </Card>
      {commentInput && (
        <TweetForm
          commentedTweetId={tweet.id}
          setCommentInput={setCommentInput}
        />
      )}
    </>
  );
}

export default TweetCard;
