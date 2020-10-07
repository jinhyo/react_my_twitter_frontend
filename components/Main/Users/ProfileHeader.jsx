import React, { useState, useCallback } from "react";
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

function ProfileHeader({ user, setLoading, handleItemClick, activeItem }) {
  return (
    <>
      <Card fluid>
        <Card.Content>
          <Image
            floated="left"
            size="small"
            src={user.avatarURL}
            width={200}
            height={200}
            className="picture__circle"
          />
          <Button floated="right" primary size="small">
            프로필 수정
          </Button>
        </Card.Content>
        <Card.Content>
          <Card.Header>@{user.nickname}</Card.Header>
          <Card.Meta>
            {user.location && (
              <>
                <Icon name="map marker alternate" /> user.location &emsp;
              </>
            )}
            <Icon name="calendar alternate outline" />
            {moment(user.createdAt).format("YYYY-MM-DD")} 가입
          </Card.Meta>
          <Card.Description>{user.selfIntro}</Card.Description>
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
                content={user.followers.length}
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
                content={user.followings.length}
              />
            </Menu.Item>
          </Menu>
        </Card.Content>
      </Card>
    </>
  );
}

export default ProfileHeader;
