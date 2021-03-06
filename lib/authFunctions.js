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

  async getLoginUserInfo() {
    const user = await axios.get("/auth/login-user");

    return user.data;
  }

  async checkDuplicateNickname(nickname) {
    const {
      data: { isAvailable }
    } = await axios.get(`/auth/nicknames/${nickname}`);

    return isAvailable;
  }

  async checkDuplicateEmail(email) {
    const {
      data: { isAvailable }
    } = await axios.get(`/auth/emails/${email}`);

    return isAvailable;
  }
}

const authFunctions = new Auth();

export default authFunctions;
