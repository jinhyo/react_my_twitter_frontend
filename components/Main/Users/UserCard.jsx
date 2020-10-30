import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Image, Card, Feed } from "semantic-ui-react";
import Link from "next/link";

import { userSelector, userActions } from "../../../features/userSlice";
import userFunctions from "../../../lib/userFunctions";
import {
  specificUserActions,
  specificUserSelector,
} from "../../../features/specificUserSlice";

// in <TweetInfoCard />, <Profile />
function UserCard({ user }) {
  const dispatch = useDispatch();

  const followings = useSelector(userSelector.followings);
  const currentUserId = useSelector(userSelector.currentUserId);
  const specificUserId = useSelector(specificUserSelector.userId);

  function didIFollow(userId, followings) {
    const index = followings.findIndex((following) => following.id === userId);
    return index !== -1;
  }

  // 현재  <UserCard />의 정보가 나인지 확인
  function isMe(userId, currentUserId) {
    return currentUserId === userId;
  }

  const displayFollowButton = useCallback(() => {
    if (isMe(user.id, currentUserId)) {
      // 나인경우
      return null;
    } else if (didIFollow(user.id, followings)) {
      // 이미 팔로우 중
      return (
        <Button
          animated
          floated="right"
          color="teal"
          size="small"
          onClick={handleUnfollowUser}
        >
          <Button.Content visible>팔로잉</Button.Content>
          <Button.Content hidden>언팔로우</Button.Content>
        </Button>
      );
    } else {
      // 언팔로오 중
      return (
        <Button floated="right" primary size="small" onClick={handleFollowUser}>
          팔로우
        </Button>
      );
    }
  }, [user, currentUserId, followings]);

  /*  팔로우 */
  const handleFollowUser = useCallback(async () => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    try {
      await userFunctions.followUser(user.id);
      dispatch(userActions.addFollowing(user.id));
      if (specificUserId === currentUserId) {
        // 내 프로필일 경우
        dispatch(specificUserActions.addFollowing(user.id));
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, currentUserId, specificUserId]);

  /*  언팔로우 */
  const handleUnfollowUser = useCallback(async () => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    try {
      await userFunctions.unfollowUser(user.id);
      dispatch(userActions.removeFollowing(user.id));

      if (specificUserId === currentUserId) {
        // 내 프로필일 경우
        dispatch(specificUserActions.removeFollowing(user.id));
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, currentUserId, specificUserId]);

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Feed>
              <Feed.Event>
                <Link href={`/users/[nickname]`} as={`/users/${user.nickname}`}>
                  <a>
                    <Image
                      floated="left"
                      width={50}
                      height={50}
                      src={user.avatarURL}
                      className="picture__circle"
                    />
                  </a>
                </Link>
                <Feed.Content>
                  <Feed.Summary>
                    <Link
                      href={`/users/[nickname]`}
                      as={`/users/${user.nickname}`}
                    >
                      <a>@{user.nickname}</a>
                    </Link>
                    {displayFollowButton()}
                  </Feed.Summary>
                  <Feed.Summary>{user.selfIntro}</Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            </Feed>
          </Card.Header>
        </Card.Content>
      </Card>
    </>
  );
}

export default UserCard;
