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

  async removeTweet(tweetId) {
    const { data: deltedTweetIds } = await axios.delete(`/tweets/${tweetId}`);

    return deltedTweetIds;
  }

  async retweet(tweetId) {
    const { data: tweets } = await axios.post(`/tweets/${tweetId}/retweet`);

    return tweets;
  }

  async cancelRetweet(tweetId) {
    const {
      data: { deletedTweetId }
    } = await axios.delete(`/tweets/${tweetId}/retweet`);

    console.log("~~~~deletedTweetId", deletedTweetId);

    return deletedTweetId;
  }

  async quoteTweet(quotedOriginId, tweetFormData) {
    const { data: tweet } = await axios.post(
      `/tweets/${quotedOriginId}/quotation`,
      tweetFormData
    );

    return tweet;
  }
}

const tweetFunctions = new Tweets();

export default tweetFunctions;
