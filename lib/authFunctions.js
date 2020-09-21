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

  async googleLogin() {
    await axios.get(`/auth/login/google`);
  }

  async facebookLogin() {
    await axios.get(`/auth/login/facebook`);
  }

  async naverLogin() {
    await axios.get(`/auth/login/naver`);
  }

  async getLoginUserInfo(url) {
    console.log("getLoginUserInfo");

    const user = await axios.get(url, { withCredentials: true });
    console.log("user", user);

    return user.data;
  }
}

const authFunctions = new Auth();

export default authFunctions;
