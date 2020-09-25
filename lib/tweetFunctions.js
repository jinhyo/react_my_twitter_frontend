import axios from "axios";

class Tweets {
  async sendTweet(contents, images) {
    console.log("~content, images", contents, images);

    const { data: tweet } = await axios.post(`/tweets`, { contents, images });

    console.log("tweet", tweet);

    return tweet;
  }
}

const tweetFunctions = new Tweets();

export default tweetFunctions;
