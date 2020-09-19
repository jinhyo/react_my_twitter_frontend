import axios from "axios";

class Auth {
  async register(email, password, nickname, selfIntro, location) {
    await axios.post(`/auth/register`, {
      email,
      password,
      nickname,
      selfIntro,
      location
    });
  }

  async localLogin({ email, password }) {
    const user = await axios.post(`/auth/login`, {
      email,
      password
    });
    return user;
  }

  async logout() {
    await axios.get(`/auth/logout`);
  }
}

const authFunctions = new Auth();

export default authFunctions;
