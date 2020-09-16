import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message
} from "semantic-ui-react";
import { useSelector } from "react-redux";
import Router from "next/router";

function Login() {
  // const isLogin = useSelector(userSelector.isLogin);
  // To DO

  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [initialState, setInitialState] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  useEffect(() => {
    if (isLogin) {
      Router.push("/");
    }
  }, [isLogin]);

  const handleInputChange = useCallback(e => {
    e.persist();
    setError("");
    setInitialState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setLoginLoading(true);
      // await firebaseApp.logIn(initialState.email, initialState.password);

      // TO DO
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("잘못된 비밀번호 입니다.");
      }
    } finally {
      setLoginLoading(false);
      Router.push("/");
    }
  }, [initialState]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setGoogleLoginLoading(true);
      // await firebaseApp.logInWithGoogle();
      //  TO DO
    } catch (error) {
      console.error(error);
    } finally {
      setGoogleLoginLoading(false);
      Router.push("/");
    }
  }, []);

  if (isLogin) return null;

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
        <Button
          loading={googleLoginLoading}
          style={{ marginTop: 30 }}
          color="blue"
          size="large"
          compact
          onClick={handleGoogleLogin}
        >
          <Icon name="google" />
          구글 로그인
        </Button>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
