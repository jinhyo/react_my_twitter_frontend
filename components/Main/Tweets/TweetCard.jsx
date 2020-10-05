import React, { useCallback, useRef, useState } from "react";
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
import TweetForm from "./TweetForm";
import Link from "next/link";

// in <Index />, <TweetInfoCard />
function TweetCard({ tweet, favoriteStatus, commentStatus }) {
  const dispatch = useDispatch();
  const afterClickRef = useRef();

  const currentUserId = useSelector(userSelector.currentUserId);

  const [commentInput, setCommentInput] = useState(false);

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

  const handleShowCommentInput = useCallback(() => {
    setCommentInput(prev => !prev);
  }, [commentInput]);

  return (
    <>
      <Card fluid>
        <Card.Content style={{ paddingBottom: 0 }}>
          <Card.Header>
            <Feed>
              <Feed.Event>
                <Link href={`/users/${tweet.user.id}`}>
                  <a>
                    <Image
                      floated="left"
                      width={50}
                      height={50}
                      src={tweet.user.avatarURL}
                      className="picture__circle"
                    />
                  </a>
                </Link>
                <Feed.Content>
                  <Feed.Summary>
                    <Link href={`/users/${tweet.user.id}`}>
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
                  {tweet.commentedOrigin && (
                    <Feed.Summary>
                      <Link href={`/users/${tweet.commentedOrigin.user.id}`}>
                        <a>@{tweet.commentedOrigin.user.nickname}</a>
                      </Link>
                      님의
                      <Link href={`/tweets/${tweet.commentedOriginId}`}>
                        <a>트윗</a>
                      </Link>
                      에 보내는 답글
                    </Feed.Summary>
                  )}
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

          {/* 답글 버튼 */}
          <Button basic color="green" onClick={handleShowCommentInput}>
            {commentStatus ? (
              <Icon name="comment" />
            ) : (
              <Icon name="comment outline" color="grey" />
            )}
            {tweet.comments.length}
          </Button>
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
