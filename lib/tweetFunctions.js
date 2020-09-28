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

  async likeTweets(tweetId) {
    await axios.post(`/tweets/${tweetId}/like`);
  }

  async unlikeTweets(tweetId) {
    await axios.delete(`/tweets/${tweetId}/like`);
  }
}

const tweetFunctions = new Tweets();

export default tweetFunctions;
