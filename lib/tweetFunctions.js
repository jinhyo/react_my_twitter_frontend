import axios from "axios";

class Tweets {
  async sendTweet(tweetFormData) {
    const { data: tweetWithOthers } = await axios.post(
      `/tweets`,
      tweetFormData
    );

    return tweetWithOthers;
  }

  async getTweets(lastId = null) {
    const { data: tweets } = await axios.get(
      lastId ? `/tweets?lastId=${lastId}&limit=10` : `/tweets?limit=10`
    );

    return tweets;
  }
}

const tweetFunctions = new Tweets();

export default tweetFunctions;
