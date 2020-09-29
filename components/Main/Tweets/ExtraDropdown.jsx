import React, { useCallback } from "react";
import { Dropdown } from "semantic-ui-react";

function ExtraDropdown({ currentUser, writerNickname, writerId }) {
  console.log("currentUser", currentUser);
  console.log("writerNickname", writerNickname);
  console.log("writerId", writerId);

  function isMyTweet() {
    return currentUser?.id === writerId;
  }

  const renderDropdownMenu = useCallback(() => {
    if (isMyTweet()) {
      // 내가 쓴 트윗
      return (
        <Dropdown.Menu>
          <Dropdown.Item icon="trash alternate" text="트윗 삭제" />
        </Dropdown.Menu>
      );
    } else {
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
