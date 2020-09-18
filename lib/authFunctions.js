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
}

const authFunctions = new Auth();

export default authFunctions;
