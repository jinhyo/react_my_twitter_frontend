import axios from "axios";

const CancelToken = axios.CancelToken;
let source;

class Search {
  async searchWord(searchWord) {
    // 검색 유형 파악(1.해시태그, 2.유저, 3.모두)
    let type = searchWord[0];
    if (type === "#") {
      type = "hashtag";
      searchWord = searchWord.slice(1);
    } else if (type === "@") {
      searchWord = searchWord.slice(1);
      type = "user";
    } else {
      type = "both";
    }

    if (source) {
      source.cancel("request canceled");
    }
    source = CancelToken.token;

    try {
      // 해시태그나 유저검색의 경우 #, @ 다음에 오는 단어가 있을 때 검색 시작
      if (
        (type === "hashtag" && searchWord.length > 0) ||
        (type === "user" && searchWord.length > 0) ||
        type === "both"
      ) {
        const { data: result } = await axios.get(
          `/search/${searchWord}?type=${type}`
        );

        return result;
      }
    } catch (error) {
      if (axios.isCancel(error) || error) {
        console.error(error);
      }
    }
  }
}

const searchFunctions = new Search();

export default searchFunctions;
