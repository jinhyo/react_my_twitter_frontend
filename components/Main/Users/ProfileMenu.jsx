import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Label } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";
import {
  specificUserSelector,
  specificUserActions
} from "../../../features/specificUserSlice";

// in <Profile />
function ProfileMenu({ handleItemClick, activeItem }) {
  const dispatch = useDispatch();

  const specificUser = useSelector(specificUserSelector.user);
  const specificUserId = useSelector(specificUserSelector.userId);
  console.log("specificUser", specificUser);

  const count = useSelector(specificUserSelector.tweetCounts);
  console.log("count", count);

  //// 매뉴 항목들의 개수 파악
  useEffect(() => {
    if (specificUserId) {
      let tweetCount = 0;
      let commentCount = 0;
      let mediaCount = 0;

      specificUser.tweets.forEach(tweet => {
        if (tweet.commentedOriginId === null) {
          tweetCount++;
          if (tweet.hasMedia) {
            mediaCount++;
          }
        } else if (tweet.commentedOriginId) {
          commentCount++;
          if (tweet.hasMedia) {
            mediaCount++;
          }
        } else if (tweet.hasMedia) {
          mediaCount++;
        }
      });

      dispatch(specificUserActions.changeTweetCount(tweetCount));
      dispatch(specificUserActions.changeCommentTweetCount(commentCount));
      dispatch(specificUserActions.changeMediaTweetCount(mediaCount));
      dispatch(
        specificUserActions.changeFavoriteTweetCount(
          specificUser.favorites.length
        )
      );
    }
  }, [specificUserId]);

  return (
    <Menu pointing widths={4}>
      <Menu.Item
        name="tweets"
        active={activeItem === "tweets"}
        onClick={handleItemClick}
      >
        트윗
        <Label basic color="teal" size="mini" content={count.tweets} />
      </Menu.Item>
      <Menu.Item
        name="comments"
        active={activeItem === "comments"}
        onClick={handleItemClick}
      >
        댓글
        <Label basic color="teal" size="mini" content={count.commentTweets} />
      </Menu.Item>
      <Menu.Item
        name="medias"
        active={activeItem === "medias"}
        onClick={handleItemClick}
      >
        미디어
        <Label basic color="teal" size="mini" content={count.mediaTweets} />
      </Menu.Item>
      <Menu.Item
        name="favoriteTweets"
        active={activeItem === "favoriteTweets"}
        onClick={handleItemClick}
      >
        좋아요
        <Label basic color="teal" size="mini" content={count.favoriteTweets} />
      </Menu.Item>
    </Menu>
  );
}

export default ProfileMenu;
