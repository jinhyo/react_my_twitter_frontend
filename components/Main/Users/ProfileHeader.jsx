import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Image, Button, Icon, Menu, Label } from "semantic-ui-react";
import moment from "moment";
import { specificUserSelector } from "../../../features/specificUserSlice";
import ProfileEditModal from "./ProfileEditModal";
import { userSelector } from "../../../features/userSlice";
import AvatarModal from "./AvatarModal";

// in <Profile />
function ProfileHeader({ handleItemClick, activeItem }) {
  const specificUser = useSelector(specificUserSelector.user);
  const currentUserId = useSelector(userSelector.currentUserId);
  const totalTweetCount = useSelector(specificUserSelector.totalTweetCount);

  const [profileModal, setProfileModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);

  const openProfileModal = useCallback(() => {
    setProfileModal(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setProfileModal(false);
  }, []);

  const openAvatarModal = useCallback(() => {
    setAvatarModal(true);
  }, []);

  const closeAvatarModal = useCallback(() => {
    setAvatarModal(false);
  }, []);
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
          {currentUserId === specificUser.id && (
            <>
              <Button
                floated="right"
                primary
                size="small"
                onClick={openProfileModal}
              >
                프로필 수정
              </Button>
              <Button
                floated="right"
                primary
                size="small"
                onClick={openAvatarModal}
              >
                아바타 수정
              </Button>
            </>
          )}
        </Card.Content>
        <Card.Content>
          <Card.Header>@{specificUser.nickname}</Card.Header>
          <Card.Meta>
            {specificUser.location && (
              <>
                <Icon name="map marker alternate" /> {specificUser.location}
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

        <ProfileEditModal modal={profileModal} closeModal={closeProfileModal} />
        <AvatarModal modal={avatarModal} closeModal={closeAvatarModal} />
      </Card>
    </>
  );
}

export default ProfileHeader;
