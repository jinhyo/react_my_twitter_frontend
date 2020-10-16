import React from "react";
import { Card, Comment } from "semantic-ui-react";
import FollowCard from "./FollowCard";

function WhoToFollow(props) {
  const user = {
    nickname: "Jin",
    location: "서울",
    selfIntro: "자기소개~~ 가나다라 마바사아 자차카타",
    avatarURL: "./asd"
  };
  return (
    <Card>
      <Card.Content>
        <Card.Header>Who to follow</Card.Header>
      </Card.Content>
      <Card.Content>
        <Comment.Group>
          <FollowCard user={user} />
          <FollowCard user={user} />
          <FollowCard user={user} />
        </Comment.Group>
      </Card.Content>
    </Card>
  );
}

export default WhoToFollow;
