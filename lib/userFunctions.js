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

  async getFollowers(userId) {
    const { data: followers } = await axios.get(`/users/${userId}/followers`);

    return followers;
  }

  async getFollowings(userId) {
    const { data: followings } = await axios.get(`/users/${userId}/followings`);

    return followings;
  }
}

const userFunctions = new Users();

export default userFunctions;
