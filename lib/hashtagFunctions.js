import axios from "axios";

class Hashtags {
  async getTweetsWithHashtag(lastId = null, tagName) {
    const {
      data: { hashtagTweets: tweets }
    } = await axios.get(
      lastId
        ? `/hashtags/tag/${tagName}?lastId=${lastId}&limit=10`
        : `/hashtags/tag/${tagName}?limit=10`
    );

    return tweets;
  }

  async getTopHashtags() {
    const { data: hashtags } = await axios.get(`/hashtags/trend`);

    return hashtags;
  }
}

const hashtagFunctions = new Hashtags();

export default hashtagFunctions;
