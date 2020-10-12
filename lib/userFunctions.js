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

  async getSpecificUsersFollowers(userId) {
    const { data: followers } = await axios.get(`/users/${userId}/followers`);

    return followers;
  }

  async getSpecificUsersFollowings(userId) {
    const { data: followings } = await axios.get(`/users/${userId}/followings`);

    return followings;
  }

  async getSpecificUsersTweets(userId) {
    const { data: tweets } = await axios.get(`/users/${userId}/tweets`);

    return tweets;
  }

  async getSpecificUsersComments(userId) {
    const { data: comments } = await axios.get(`/users/${userId}/comments`);

    return comments;
  }

  async getSpecificUsersMediaTweets(userId) {
    const { data: medias } = await axios.get(`/users/${userId}/medias`);

    return medias;
  }

  async getSpecificUsersFavorites(userId) {
    const { data: favorites } = await axios.get(`/users/${userId}/favorites`);

    return favorites;
  }

  async editProfile(nickname, selfIntro, location) {
    await axios.patch(`/users/profile`, {
      nickname,
      selfIntro,
      location
    });
  }
}

const userFunctions = new Users();

export default userFunctions;
