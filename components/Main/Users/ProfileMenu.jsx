import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Label } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";

function ProfileMenu({ setLoading, handleItemClick, activeItem }) {
  const specificUser = useSelector(userSelector.specificUser);

  const [tweetCount, setTweetCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  //// 매뉴 항목들의 개수 파악
  useEffect(() => {
    if (specificUser) {
      let tweetCount = 0;
      let commentCount = 0;
      let mediaCount = 0;

      specificUser.tweets.forEach(tweet => {
        if (tweet.commentedOriginId) {
          commentCount++;
        } else if (tweet.hasMedia) {
          mediaCount++;
        } else {
          tweetCount++;
        }
      });

      setTweetCount(tweetCount);
      setCommentCount(commentCount);
      setMediaCount(mediaCount);
      setFavoriteCount(specificUser.favorites.length);
    }
  }, [specificUser]);

  return (
    <Menu pointing widths={4}>
      <Menu.Item
        name="tweets"
        active={activeItem === "tweets"}
        onClick={handleItemClick}
      >
        트윗
        <Label basic color="teal" size="mini" content={tweetCount} />
      </Menu.Item>
      <Menu.Item
        name="comments"
        active={activeItem === "comments"}
        onClick={handleItemClick}
      >
        댓글
        <Label basic color="teal" size="mini" content={commentCount} />
      </Menu.Item>
      <Menu.Item
        name="medias"
        active={activeItem === "medias"}
        onClick={handleItemClick}
      >
        미디어
        <Label basic color="teal" size="mini" content={mediaCount} />
      </Menu.Item>
      <Menu.Item
        name="likedTweets"
        active={activeItem === "likedTweets"}
        onClick={handleItemClick}
      >
        좋아요
        <Label basic color="teal" size="mini" content={favoriteCount} />
      </Menu.Item>
    </Menu>
  );
}

export default ProfileMenu;
