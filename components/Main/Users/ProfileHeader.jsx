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

function ProfileHeader({ user, setLoading, handleItemClick, activeItem }) {
  return (
    <>
      <Card fluid>
        <Card.Content>
          <Image
            floated="left"
            size="small"
            src="/temp.jpg"
            width={200}
            height={200}
            className="picture__circle"
          />
          <Button floated="right" primary size="small">
            프로필 수정
          </Button>
        </Card.Content>
        <Card.Content>
          <Card.Header>JJ</Card.Header>
          <Card.Meta>
            @Jin &emsp;
            <Icon name="map marker alternate" /> 서울 &emsp;
            <Icon name="calendar alternate outline" /> 20017년 8월 15일 가입
          </Card.Meta>
          <Card.Description>자기소개</Card.Description>
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
                content="1" /* content={tweet.likers.length} */
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
                content="1" /* content={tweet.likers.length} */
              />
            </Menu.Item>
          </Menu>
        </Card.Content>
      </Card>
    </>
  );
}

export default ProfileHeader;
