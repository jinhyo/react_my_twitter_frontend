import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Image, Divider, Button } from "semantic-ui-react";

import { searchActions } from "../../features/searchSlice";
import { userSelector } from "../../features/userSlice";

function SearchResults({ hashtags, users, handleSearchWord }) {
  const dispatch = useDispatch();
  const followings = useSelector(userSelector.followings);

  const handleClickLink = useCallback((searchWord, userNickname) => {
    dispatch(searchActions.setSearchWord(userNickname || searchWord));

    handleSearchWord(searchWord);
  }, []);

  const didIFollow = useCallback(
    userId => {
      const index = followings.findIndex(following => following.id === userId);
      return index !== -1;
    },
    [followings]
  );

  return (
    <List divided selection verticalAlign="middle" className="searchResults">
      {/* 해시태그 검색 결과 */}
      {hashtags.map(hashtag => (
        <List.Item
          key={hashtag.tag}
          onClick={() => handleClickLink(`#${hashtag.tag}`)}
        >
          <List.Content>
            <List.Header as="h3">
              <a>#{hashtag.tag}</a>
            </List.Header>
          </List.Content>
        </List.Item>
      ))}

      {hashtags.length > 0 && <Divider fitted />}

      {/* 유저 닉네임 검색 결과 */}
      {users.map(user => (
        <List.Item
          key={user.id}
          onClick={() => handleClickLink(`@${user.nickname}`)}
        >
          <Image avatar src={user.avatarURL} />
          <List.Content>
            <List.Header as="h3">
              <a>{user.nickname}</a>
            </List.Header>
          </List.Content>
          {/* 팔로우  중인지 표시 */}
          {didIFollow(user.id) && (
            <List.Content floated="right">
              <Button basic disabled size="tiny">
                <h5>팔로잉</h5>
              </Button>
            </List.Content>
          )}
        </List.Item>
      ))}
    </List>
  );
}

export default SearchResults;
