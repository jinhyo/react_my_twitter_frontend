import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Icon } from "semantic-ui-react";
import searchFunctions from "../../lib/searchFunctions";
import SearchResults from "./SearchResults";
import { useRouter } from "next/router";
import { searchSelector, searchActions } from "../../features/searchSlice";

// in <BaseHeader />
function SearchBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const searchWord = useSelector(searchSelector.searchWord);
  const searchResults = useSelector(searchSelector.searchResults);
  const showSearchResults = useSelector(searchSelector.showSearchResults);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchWord) {
      getSearchResult(searchWord, showSearchResults);
    }
  }, [searchWord]);

  const handleInputChange = useCallback(
    e => {
      if (!showSearchResults) {
        dispatch(searchActions.setShowSearchResults(true));
      }

      const inputSearchWord = e.target.value;
      if (!inputSearchWord) {
        dispatch(searchActions.setSearchWord(inputSearchWord));
        dispatch(searchActions.clearSearchResults());
      } else {
        dispatch(searchActions.setSearchWord(inputSearchWord));
        setLoading(true);
      }
    },
    [searchWord, showSearchResults]
  );

  async function getSearchResult(searchWord) {
    const result = await searchFunctions.searchWord(searchWord);
    setLoading(false);
    dispatch(searchActions.setSearchResults(result));
  }

  /* 검색결과 클릭 or 검색창에서 엔터 */
  const handleSearchWord = useCallback(text => {
    dispatch(searchActions.setShowSearchResults(false));

    if (text[0] === "#") {
      // 해시태그 검색
      router.push(`/hashtags/${text.slice(1)}`);
    } else if (text[0] === "@") {
      // 유저 닉네임 검색
      router.push(`/users/${text.slice(1)}`);
    } else {
      // 앞에 # 또는 @을 붙이지 않고 엔터를 누를 경우 기본적으로 해시태그를 검색
      dispatch(searchActions.setSearchWord(`#${text}`));
      router.push(`/hashtags/${text}`);
    }
  }, []);

  const handleInputKeyPress = useCallback(
    e => {
      console.log("handleInputKeyPress");

      if (e.key === "Enter") {
        console.log("~~~~handleInputKeyPress");
        handleSearchWord(searchWord);
      }
    },
    [searchWord]
  );

  return (
    <>
      <Input
        icon={{
          name: "search",
          link: true,
          loading,
          onClick: () => handleSearchWord(searchWord)
        }}
        onChange={handleInputChange}
        value={searchWord}
        style={{ width: 250 }}
        placeholder="#해시태그, @닉네임 검색"
        onKeyPress={handleInputKeyPress}
      ></Input>

      {/* 검색 결과 */}
      {showSearchResults && searchResults && (
        <SearchResults
          hashtags={searchResults.hashtags}
          handleSearchWord={handleSearchWord}
          users={searchResults.users}
        />
      )}
    </>
  );
}

export default SearchBar;