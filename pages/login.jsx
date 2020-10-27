import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Form,
  Segment,
  Button,
  Message,
  Divider,
  Image
} from "semantic-ui-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

import authFunctions from "../lib/authFunctions";
import { userActions, userSelector } from "../features/userSlice";
import wrapper from "../store/configureStore";

const INITIAL_VALUE = { email: "", password: "" };

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [error, setError] = useState("");
  const [initialState, setInitialState] = useState(INITIAL_VALUE);
  const [loginLoading, setLoginLoading] = useState(false);
  const currentUserId = useSelector(userSelector.currentUserId);

  useEffect(() => {
    // 로그인 상태에서 접근하지 못하도록
    if (currentUserId) {
      alert("로그인 중에는 접근할 수 없습니다.");
      router.push("/");
    }
  }, []);

  const handleInputChange = useCallback(e => {
    e.persist();
    setError("");
    setInitialState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  function checkInputError(initialState) {
    if (initialState.email.length < 1) {
      setError("이메일을 입력하세요");
      return true;
    } else if (initialState.password.length < 1) {
      setError("비밀번호를 입력하세요.");
      return true;
    } else {
      return false;
    }
  }
  // 로컬 로그인
  const handleSubmit = useCallback(async () => {
    const hasError = checkInputError(initialState);
    if (hasError) {
      return;
    }

    try {
      setLoginLoading(true);
      const currentUser = await authFunctions.localLogin({
        email: initialState.email,
        password: initialState.password
      });
      dispatch(userActions.setCurrentUser(currentUser.data));
      router.push("/");
      setInitialState(INITIAL_VALUE);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data || error);
    } finally {
      setLoginLoading(false);
    }
  }, [initialState]);

  // 구글 로그인
  const handleGoogleLogin = useCallback(async () => {
    try {
      await authFunctions.googleLogin();
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 페북 로그인
  const handleFacebookLogin = useCallback(async () => {
    try {
      await authFunctions.facebookLogin();
    } catch (error) {
      console.error(error);
    }
  }, []);

  if (currentUserId) return null;

  return (
    <Grid
      style={{ marginTop: 40 }}
      textAlign="center"
      verticalAlign="middle"
      className="app"
    >
      <Grid.Column width={10}>
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="이메일"
              type="email"
              value={initialState.email}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="비밀번호"
              autoComplete="off"
              type="password"
              value={initialState.password}
              onChange={handleInputChange}
            />
            <Form.Field>
              <Message
                error={!error}
                color="yellow"
                header={error}
                size="mini"
              />
              <Button
                loading={loginLoading}
                color="blue"
                size="large"
                width="40"
                compact
                fluid
              >
                로그인
              </Button>
            </Form.Field>
          </Segment>
        </Form>
        <Divider />
        <div className="ui two images">
          <Image
            circular
            src="/google.png"
            className="button__login"
            onClick={handleGoogleLogin}
          />
          <Image
            circular
            src="/facebook.png"
            className="button__login"
            onClick={handleFacebookLogin}
          />
        </div>
      </Grid.Column>
    </Grid>
  );
}

/* 서버사이드 렌더링 */
export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store, req }) => {
    // 프론트 서버에서 백엔드에 쿠키 전달
    const cookie = req ? req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (req && cookie) {
      // 서버일 떄와 쿠키가 있을 경우
      axios.defaults.headers.Cookie = cookie; // 로그인 정보가 백엔드 서버로 넘어감
    }

    try {
      const user = await authFunctions.getLoginUserInfo();
      store.dispatch(userActions.setCurrentUser(user));
    } catch (error) {
      console.error(error);
    }
  }
);

export default Login;
