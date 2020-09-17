import React from "react";
import { Comment, Icon, Button } from "semantic-ui-react";

function FollowCard({ user }) {
  return (
    <Comment>
      <Comment.Avatar as="a" src="/images/avatar/small/matt.jpg" />
      <Comment.Content>
        <Comment.Author as="a">{user.nickname}</Comment.Author>
        <Comment.Metadata>
          <span>
            <Icon name="map marker alternate" style={{ marginRight: 5 }} />
            {user.location}
          </span>
        </Comment.Metadata>
        <Button floated="right" size="small" primary>
          팔로우
        </Button>
        <Comment.Text>{user.selfIntro}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default FollowCard;
