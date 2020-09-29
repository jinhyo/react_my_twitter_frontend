import axios from "axios";

class Users {
  async followUser(userId) {
    await axios.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId) {
    await axios.delete(`/users/${userId}/follow`);
  }
}

const userFunctions = new Users();

export default userFunctions;
