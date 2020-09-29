import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  Icon,
  Feed,
  Image,
  Popup,
  Dropdown
} from "semantic-ui-react";
import moment from "moment";
import TweetImages from "./TweetImages";
import TweetContents from "./TweetContents";
import tweetFunctions from "../../../lib/tweetFunctions";
import { userActions, userSelector } from "../../../features/userSlice";
import { tweetActions } from "../../../features/tweetSlice";
import ExtraDropdown from "./ExtraDropdown";

function TweetCard({ tweet, favoriteStatus }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  //// 좋아요 버튼 클릭(추가 & 삭제)
  const handleClickLike = useCallback(async () => {
    if (!currentUser) {
      return alert("로그인이 필요합니다.");
    }

    if (favoriteStatus) {
      // 좋아요 삭제
      try {
        await tweetFunctions.unlikeTweets(tweet.id);

        dispatch(
          tweetActions.unlikeTweet({ myId: currentUser.id, tweetId: tweet.id })
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
          tweetActions.likeTweet({ myId: currentUser.id, tweetId: tweet.id })
        );
        dispatch(userActions.addFavoriteTweetsToMe(tweet.id));
      } catch (error) {
        console.error(error);
      }
    }
  }, [favoriteStatus, currentUser]);

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
                  <ExtraDropdown
                    currentUser={currentUser}
                    writerNickname={tweet.user.nickname}
                    writerId={tweet.user.id}
                  />
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
        <Button basic color="green">
          <Icon name="comment outline" /> 0
        </Button>
        <Button basic color="green">
          <Icon name="retweet" />
          {tweet.retweetOriginId ? tweet.retweets.length : 0}
        </Button>
        <Button basic color="green" onClick={handleClickLike}>
          {favoriteStatus ? (
            <Icon name="heart" color="red" />
          ) : (
            <Icon name="heart outline" color="green" />
          )}
          {tweet.likers.length}
        </Button>
      </Card.Content>
    </Card>
  );
}

export default TweetCard;
