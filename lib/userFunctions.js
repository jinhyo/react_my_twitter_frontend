import axios from "axios";

class Users {
  async followUser(userId) {
    await axios.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId) {
    await axios.delete(`/users/${userId}/follow`);
  }

  async getRetweetUsers(tweetId) {
    const { data: users } = await axios.get(`/users/retweet/${tweetId}`);

    return users;
  }

  async getLikers(tweetId) {
    const { data: users } = await axios.get(`/users/like/${tweetId}`);

    return users;
  }

  async getSpecificUser(userId) {
    const { data: user } = await axios.get(`/users/${userId}`);

    return user;
  }
}

const userFunctions = new Users();

export default userFunctions;
