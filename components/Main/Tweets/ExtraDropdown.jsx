import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Button, Icon } from "semantic-ui-react";
import tweetFunctions from "../../../lib/tweetFunctions";
import { tweetActions } from "../../../features/tweetSlice";
import userFunctions from "../../../lib/userFunctions";
import { userActions, userSelector } from "../../../features/userSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  specificUserActions,
  specificUserSelector
} from "../../../features/specificUserSlice";
import {
  specificTweetSelector,
  specificTweetActions
} from "../../../features/specificTweetSlice";

// in <TweetCard />, <PureRetweetCard />
function ExtraDropdown({
  currentUserId,
  writerNickname,
  writerId,
  tweetId,
  tweet
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const followings = useSelector(userSelector.followings);
  const specificUserId = useSelector(specificUserSelector.userId);
  const specificTweetId = useSelector(specificTweetSelector.specificTweetId);
  const currentMenuItem = useSelector(specificTweetSelector.currentMenuItem);

  /* 트윗 삭제 */
  const handleRemoveTweet = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      try {
        const deltedTweetIds = await tweetFunctions.removeTweet(tweetId);

        if (specificUserId) {
          // specificUser에게 적용
          dispatch(specificUserActions.removeTweet(tweetId));

          // 인용한 트윗인 경우 인용된 트윗의 리트윗 카운트 감소
          if (tweet.quotedOriginId) {
            dispatch(
              specificUserActions.decreaseRetweetCount(tweet.quotedOriginId)
            );
          }
        } else {
          // currentUser에게 적용
          dispatch(tweetActions.removeTweet(tweetId));

          // 인용한 트윗인 경우 인용된 트윗의 리트윗 카운트 감소
          if (tweet.quotedOriginId) {
            dispatch(tweetActions.decreaseRetweetCount(tweet.quotedOriginId));
          }

          // 댓글인 경우 댓글을 단 트윗의 댓글 state를 변경 in redux
          if (tweet.commentedOriginId) {
            dispatch(
              tweetActions.removeComment({
                commentedOriginId: tweet.commentedOriginId,
                commentTweetId: tweetId
              })
            );
          }
        }

        dispatch(userActions.removeMyTweet(deltedTweetIds));

        if (specificTweetId && tweet.quotedOriginId) {
          // 트윗 상세보기에서 인용한 트윗 카운트 감소
          dispatch(specificTweetActions.removeQuotation(tweetId));
        } else if (specificTweetId && currentMenuItem === "comments") {
          // 트윗 상세보기에서 해당 트윗의 댓글 삭제 시 카운트 감소
          dispatch(specificTweetActions.removeComment(tweetId));
        } else if (specificTweetId && specificTweetId === tweetId) {
          // 트윗 상세보기에서 해당 트윗을 삭제하면 홈으로 이동
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  /*  팔로우 */
  const handleFollowUser = useCallback(async () => {
    try {
      await userFunctions.followUser(writerId);
      dispatch(userActions.addFollowing(writerId));

      if (specificUserId) {
        // specificUser 용
        dispatch(specificUserActions.addFollowing(writerId));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  /*  언팔로우 */
  const handleUnfollowUser = useCallback(async () => {
    try {
      await userFunctions.unfollowUser(writerId);
      dispatch(userActions.removeFollowing(writerId));

      if (specificUserId) {
        // currentUser 용
        dispatch(specificUserActions.removeFollowing(writerId));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  function isMyTweet() {
    return currentUserId === writerId;
  }

  function isMyFollowing() {
    const index = followings.findIndex(following => following.id === writerId);

    return index !== -1;
  }

  const renderDropdownMenu = useCallback(() => {
    if (isMyTweet()) {
      // 내가 쓴 트윗
      return (
        <Dropdown.Menu>
          <Dropdown.Item
            style={{ color: "red" }}
            icon="trash alternate"
            text="트윗 삭제"
            onClick={handleRemoveTweet}
          />
          <Link
            href={`/tweets/[tweetId]`}
            as={`/tweets/${tweet.retweetOriginId || tweet.id}`}
          >
            <a className="item">
              <Dropdown.Item icon="info circle" text="상세 보기" />
            </a>
          </Link>
        </Dropdown.Menu>
      );
    } else {
      // 다른 사람이 쓴 트윗
      if (isMyFollowing()) {
        // 내가 팔로우 중인 대상의 트윗
        return (
          <Dropdown.Menu>
            <Dropdown.Item
              icon="remove user"
              text={`'${writerNickname}'님을 언팔로우 합니다`}
              onClick={handleUnfollowUser}
            />
            <Dropdown.Item
              icon="ban"
              text={`'${writerNickname}'님을 차단 합니다.`}
            />
            <Link
              href={`/tweets/[tweetId]`}
              as={`/tweets/${tweet.retweetOriginId || tweet.id}`}
            >
              <a className="item">
                <Dropdown.Item icon="info circle" text="상세 보기" />
              </a>
            </Link>
          </Dropdown.Menu>
        );
      } else {
        // 내가 언팔로우 중인 대상의 트윗
        return (
          <Dropdown.Menu>
            <Dropdown.Item
              icon="add user"
              text={`'${writerNickname}'님을 팔로우 합니다`}
              onClick={handleFollowUser}
            />
            <Dropdown.Item
              icon="ban"
              text={`'${writerNickname}'님을 차단 합니다.`}
            />
            <Link
              href={`/tweets/[tweetId]`}
              as={`/tweets/${tweet.retweetOriginId || tweet.id}`}
            >
              <a className="item">
                <Dropdown.Item icon="info circle" text="상세 보기" />
              </a>
            </Link>
          </Dropdown.Menu>
        );
      }
    }
  }, [currentUserId, followings, tweet]);

  return (
    <Dropdown
      icon="bars"
      pointing="right"
      style={{ position: "absolute", right: 20 }}
    >
      {tweet && renderDropdownMenu()}
    </Dropdown>
  );
}

export default ExtraDropdown;
