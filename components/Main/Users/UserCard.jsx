import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Button, Divider, Image, Card, Feed } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";
import Link from "next/link";

// in <TweetInfoCard />
function UserCard({ user }) {
  const followings = useSelector(userSelector.followings);
  const currentUserId = useSelector(userSelector.currentUserId);

  function didIFollow(userId, followings) {
    const index = followings.findIndex(following => following.id === userId);
    return index !== -1;
  }

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
        <Button animated floated="right" color="teal" size="mini">
          <Button.Content visible>팔로잉</Button.Content>
          <Button.Content hidden>언팔로우</Button.Content>
        </Button>
      );
    } else {
      // 언팔로오 중
      return (
        <Button floated="right" primary size="mini">
          팔로우
        </Button>
      );
    }
  }, [user, currentUserId, followings]);

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Feed>
            <Feed.Event>
              <Link href={`/users/[userId]`} as={`/users/${user.id}`}>
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
                  <Link href={`/users/[userId]`} as={`/users/${user.id}`}>
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
  );
  팔로우, 언팔로우 기능 in <UserCard />
  //   return (
  // <Comment style={{ marginBottom: 10 }}>
  //   <Comment.Avatar src={user.avatarURL} />

  //   {/* {displayFollowButton()} */}

  //   <Comment.Content>
  //     <Comment.Author>@{user.nickname}</Comment.Author>
  //     <Comment.Text>{user.selfIntro}</Comment.Text>
  //   </Comment.Content>
  // </Comment>
  //   );
}

export default UserCard;
