import React from "react";
import { Comment, Button, Divider } from "semantic-ui-react";

function Follower(props) {
  return (
    <Comment style={{ cursor: "pointer" }}>
      <Comment.Avatar src="./" />
      <Button animated floated="right" primary>
        <Button.Content visible>팔로우중</Button.Content>
        <Button.Content hidden>언팔로우</Button.Content>
      </Button>
      <Comment.Content>
        <Comment.Author>ADD</Comment.Author>
        <Comment.Metadata>@addy</Comment.Metadata>
        <Comment.Text>자기소개</Comment.Text>
      </Comment.Content>
      <Divider />
    </Comment>
  );
}

export default Follower;
