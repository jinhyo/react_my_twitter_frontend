import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Button } from "semantic-ui-react";
import tweetFunctions from "../../../lib/tweetFunctions";
import { tweetActions } from "../../../features/tweetSlice";
import userFunctions from "../../../lib/userFunctions";
import { userActions, userSelector } from "../../../features/userSlice";

// in <TweetCard /> or <PureRetweetCard />
function ExtraDropdown({ currentUserId, writerNickname, writerId, tweetId }) {
  const dispatch = useDispatch();

  const followings = useSelector(userSelector.followings);

  //// 트윗 삭제
  const handleRemoveTweet = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      try {
        await tweetFunctions.removeTweet(tweetId);
        dispatch(tweetActions.removeTweet(tweetId));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  //// 팔로우
  const handleFollowUser = useCallback(async () => {
    try {
      await userFunctions.followUser(writerId);
      dispatch(userActions.addFollowing(writerId));
    } catch (error) {
      console.error(error);
    }
  }, []);

  //// 언팔로우
  const handleUnfollowUser = useCallback(async () => {
    try {
      await userFunctions.unfollowUser(writerId);
      dispatch(userActions.removeFollowing(writerId));
    } catch (error) {
      console.error(error);
    }
  }, []);

  function isMyTweet() {
    return currentUserId === writerId;
  }

  function isMyFollowing() {
    const index = followings.findIndex(following => following.id === writerId);

    return index !== -1;
  }

  const renderDropdownMenu = useCallback(() => {
    if (isMyTweet()) {
      // 내가 쓴 트윗
      return (
        <Dropdown.Menu>
          <Dropdown.Item
            style={{ color: "red" }}
            icon="trash alternate"
            text="트윗 삭제"
            onClick={handleRemoveTweet}
          />
        </Dropdown.Menu>
      );
    } else {
      // 다른 사람이 쓴 트윗
      if (isMyFollowing()) {
        // 내가 팔로우 중인 대상의 트윗
        return (
          <Dropdown.Menu>
            <Dropdown.Item
              icon="remove user"
              text={`'${writerNickname}'님을 언팔로우 합니다`}
              onClick={handleUnfollowUser}
            />
            <Dropdown.Item
              icon="ban"
              text={`'${writerNickname}'님을 차단 합니다.`}
            />
          </Dropdown.Menu>
        );
      } else {
        // 내가 언팔로우 중인 대상의 트윗
        return (
          <Dropdown.Menu>
            <Dropdown.Item
              icon="add user"
              text={`'${writerNickname}'님을 팔로우 합니다`}
              onClick={handleFollowUser}
            />
            <Dropdown.Item
              icon="ban"
              text={`'${writerNickname}'님을 차단 합니다.`}
            />
          </Dropdown.Menu>
        );
      }
    }
  }, [currentUserId, followings]);

  return (
    <Dropdown
      icon="bars"
      pointing="right"
      style={{ position: "absolute", right: 20 }}
    >
      {renderDropdownMenu()}
    </Dropdown>
  );
}

export default ExtraDropdown;
