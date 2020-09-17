import React from "react";
import { Comment, Button, Divider } from "semantic-ui-react";

function Following(props) {
  return (
    <Comment style={{ cursor: "pointer" }}>
      <Comment.Avatar src="./" />
      <Button animated floated="right" color="green">
        <Button.Content visible>팔로윙중</Button.Content>
        <Button.Content hidden>언팔로윙</Button.Content>
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

export default Following;
