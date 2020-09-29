import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import tweetFunctions from "../../../lib/tweetFunctions";
import { tweetActions } from "../../../features/tweetSlice";

function ExtraDropdown({ currentUser, writerNickname, writerId, tweetId }) {
  const dispatch = useDispatch();

  const handleRemoveTweet = useCallback(async () => {
    try {
      await tweetFunctions.removeTweet(tweetId);
      dispatch(tweetActions.removeTweet(tweetId));
    } catch (error) {
      console.error(error);
    }
  }, []);

  function isMyTweet() {
    return currentUser?.id === writerId;
  }

  const renderDropdownMenu = useCallback(() => {
    if (isMyTweet()) {
      // 내가 쓴 트윗
      return (
        <Dropdown.Menu>
          <Dropdown.Item
            icon="trash alternate"
            text="트윗 삭제"
            onClick={handleRemoveTweet}
          />
        </Dropdown.Menu>
      );
    } else {
      // 다른 사람이 쓴 트윗
      return (
        <Dropdown.Menu>
          <Dropdown.Item text={`'${writerNickname}'님을 팔로우 합니다`} />
          <Dropdown.Item text={`${writerNickname}님을 차단 합니다.`} />
        </Dropdown.Menu>
      );
    }
  }, []);

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
