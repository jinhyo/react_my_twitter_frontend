import React from "react";
import { Menu, Label } from "semantic-ui-react";

function ProfileMenu({ user, setLoading, handleItemClick, activeItem }) {
  return (
    <Menu pointing widths={4}>
      <Menu.Item
        name="tweets"
        active={activeItem === "tweets"}
        onClick={handleItemClick}
      >
        트윗
        <Label
          basic
          color="teal"
          size="mini"
          content="1" /* content={tweet.comments.length} */
        />
      </Menu.Item>
      <Menu.Item
        name="replies"
        active={activeItem === "replies"}
        onClick={handleItemClick}
      >
        댓글
        <Label
          basic
          color="teal"
          size="mini"
          content="1" /* content={tweet.retweets.length} */
        />
      </Menu.Item>
      <Menu.Item
        name="medias"
        active={activeItem === "medias"}
        onClick={handleItemClick}
      >
        미디어
        <Label
          basic
          color="teal"
          size="mini"
          content="1" /* content={tweet.quotations.length} */
        />
      </Menu.Item>
      <Menu.Item
        name="likedTweets"
        active={activeItem === "likedTweets"}
        onClick={handleItemClick}
      >
        좋아요
        <Label
          basic
          color="teal"
          size="mini"
          content="1" /* content={tweet.quotations.length} */
        />
      </Menu.Item>
    </Menu>
  );
}

export default ProfileMenu;
