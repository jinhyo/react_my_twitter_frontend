import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Image,
  Button,
  Icon,
  Menu,
  Label,
  Loader
} from "semantic-ui-react";
import moment from "moment";
import { specificUserSelector } from "../../../features/specificUserSlice";

// in <Profile />
function ProfileHeader({ handleItemClick, activeItem }) {
  const specificUser = useSelector(specificUserSelector.user);
  const totalTweetCount = useSelector(specificUserSelector.totalTweetCount);
  return (
    <>
      <Card fluid>
        <Card.Content>
          <Image
            floated="left"
            size="small"
            src={specificUser.avatarURL}
            width={200}
            height={200}
            className="picture__circle"
          />
          <Button floated="right" primary size="small">
            프로필 수정
          </Button>
        </Card.Content>
        <Card.Content>
          <Card.Header>@{specificUser.nickname}</Card.Header>
          <Card.Meta>
            {specificUser.location && (
              <>
                <Icon name="map marker alternate" /> specificUser.location
                &emsp;
              </>
            )}
            <Icon name="calendar alternate outline" />
            {moment(specificUser.createdAt).format("YYYY-MM-DD")} 가입 &emsp;
            작성한 트윗: {totalTweetCount}
          </Card.Meta>
          <Card.Description>{specificUser.selfIntro}</Card.Description>
        </Card.Content>
        <Card.Content>
          <Menu widths={2}>
            <Menu.Item
              name="followers"
              active={activeItem === "followers"}
              onClick={handleItemClick}
            >
              팔로워
              <Label
                basic
                color="teal"
                size="mini"
                content={specificUser.followers.length}
              />
            </Menu.Item>
            <Menu.Item
              name="followings"
              active={activeItem === "followings"}
              onClick={handleItemClick}
            >
              팔로잉
              <Label
                basic
                color="teal"
                size="mini"
                content={specificUser.followings.length}
              />
            </Menu.Item>
          </Menu>
        </Card.Content>
      </Card>
    </>
  );
}

export default ProfileHeader;
