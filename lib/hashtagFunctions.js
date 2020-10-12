import axios from "axios";

class Hashtags {
  async getTweetsWithHashtag(lastId = null, tagName) {
    const {
      data: { hashtagTweets: tweets }
    } = await axios.get(
      lastId
        ? `/hashtags/${tagName}?lastId=${lastId}&limit=10`
        : `/hashtags/${tagName}?limit=10`
    );

    return tweets;
  }
}

const hashtagFunctions = new Hashtags();

export default hashtagFunctions;
