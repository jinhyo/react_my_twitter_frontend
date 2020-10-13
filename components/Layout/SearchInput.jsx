import React, { useState, useEffect, useCallback } from "react";
import { Input } from "semantic-ui-react";
import searchFunctions from "../../lib/searchFunctions";

// in <BaseHeader />
function SearchInput() {
  const [text, setText] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  console.log("~~~~result", result);

  useEffect(() => {
    if (text) {
      getSearchResult(text);
    }
  }, [text]);

  const handleInputChange = useCallback(
    e => {
      const searchWord = e.target.value;
      if (!searchWord) {
        setText(e.target.value);
        setResult({});
      } else {
        setText(e.target.value);
        setLoading(true);
      }
    },
    [text]
  );

  async function getSearchResult(searchWord) {
    const result = await searchFunctions.searchWord(searchWord);
    setLoading(false);
    setResult(result);
    console.log("!!~~~~result", result);
  }

  return (
    <Input
      icon={{ name: "search", circular: true, link: true, loading: loading }}
      onChange={handleInputChange}
      value={text}
      placeholder="해시태그, 닉네임 검색"
    />
  );
}

export default SearchInput;
