import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Image, Button, Icon, Menu, Label } from "semantic-ui-react";
import moment from "moment";

import {
  specificUserSelector,
  specificUserActions
} from "../../../features/specificUserSlice";
import ProfileEditModal from "./ProfileEditModal";
import { userSelector, userActions } from "../../../features/userSlice";
import AvatarModal from "./AvatarModal";
import userFunctions from "../../../lib/userFunctions";

// in <Profile />
function ProfileHeader({ handleItemClick, activeItem }) {
  const dispatch = useDispatch();

  const specificUser = useSelector(specificUserSelector.user);
  const userCardInfo = useSelector(userSelector.userCardInfo);
  const currentUserId = useSelector(userSelector.currentUserId);
  const totalTweetCount = useSelector(specificUserSelector.totalTweetCount);
  const followings = useSelector(userSelector.followings);

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

  function didIFollow(userId, followings) {
    const index = followings.findIndex(following => following.id === userId);
    return index !== -1;
  }

  /*  현재  <UserCard />의 정보가 나인지 확인 */
  function isMe(userId, currentUserId) {
    return currentUserId === userId;
  }

  const displayButtons = useCallback(() => {
    if (isMe(specificUser.id, currentUserId)) {
      // 나인경우
      return (
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
      );
    } else if (didIFollow(specificUser.id, followings)) {
      // 이미 팔로우 중
      return (
        <Button
          animated
          floated="right"
          color="teal"
          size="small"
          onClick={handleUnfollowUser}
        >
          <Button.Content visible>팔로잉</Button.Content>
          <Button.Content hidden>언팔로우</Button.Content>
        </Button>
      );
    } else {
      // 언팔로오 중
      return (
        <Button floated="right" primary size="small" onClick={handleFollowUser}>
          팔로우
        </Button>
      );
    }
  }, [specificUser, currentUserId, followings]);

  /*  팔로우 */
  const handleFollowUser = useCallback(async () => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    try {
      await userFunctions.followUser(specificUser.id);
      dispatch(userActions.addFollowing(specificUser.id));
      dispatch(specificUserActions.addFollower(userCardInfo));
    } catch (error) {
      console.error(error);
    }
  }, [specificUser, currentUserId]);

  /*  언팔로우 */
  const handleUnfollowUser = useCallback(async () => {
    if (!currentUserId) {
      return alert("로그인이 필요합니다.");
    }

    try {
      await userFunctions.unfollowUser(specificUser.id);
      dispatch(userActions.removeFollowing(specificUser.id));
      dispatch(specificUserActions.removeFollower(currentUserId));
    } catch (error) {
      console.error(error);
    }
  }, [specificUser, currentUserId]);

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

          {displayButtons()}
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
