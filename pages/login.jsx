import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
  Divider,
  Image
} from "semantic-ui-react";
import Router from "next/router";
import authFunctions from "../lib/authFunctions";
import { userActions } from "../features/userSlice";
import { toast } from "react-toastify";

const INITIAL_VALUE = { email: "", password: "" };

function Login() {
  const dispatch = useDispatch();
  // const isLogin = useSelector(userSelector.isLogin);
  // To DO

  // const [isLogin, setIsLogin] = useState(false);

  const [error, setError] = useState("");
  const [initialState, setInitialState] = useState(INITIAL_VALUE);
  const [loginLoading, setLoginLoading] = useState(false);

  // useEffect(() => {
  //   if (isLogin) {
  //     Router.push("/");
  //   }
  // }, [isLogin]);

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
      console.log("hasError", hasError);
      return;
    }

    try {
      setLoginLoading(true);
      const currentUser = await authFunctions.localLogin({
        email: initialState.email,
        password: initialState.password
      });
      dispatch(userActions.setCurrentUser(currentUser.data));
    } catch (error) {
      console.error(error);
      toast.error(error.response.data);
      setError(error.response.data);
    } finally {
      setLoginLoading(false);
      setInitialState(INITIAL_VALUE);
      Router.push("/");
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

  // 네이버 로그인
  const handleNaverLogin = useCallback(async () => {
    try {
      await authFunctions.naverLogin();
    } catch (error) {
      console.error(error);
    }
  }, []);

  // if (isLogin) return null;

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
        <div className="ui three images">
          <Image
            circular
            src="/naver.png"
            className="button__login"
            onClick={handleNaverLogin}
          />
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

export default Login;
