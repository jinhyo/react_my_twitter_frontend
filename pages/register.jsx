import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
  Input,
  TextArea,
  Checkbox
} from "semantic-ui-react";
import Router from "next/router";
import validateRegisterForm from "../lib/validateRegisterForm";
import useFormInput from "../hooks/useFormInput";
import { toast } from "react-toastify";
import authFunctions from "../lib/authFunctions";
import { userActions } from "../features/userSlice";

const INITIAL_VALUES = {
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  location: "",
  selfIntro: ""
};

function Register(props) {
  const [isLogin, setIsLogin] = useState(false);
  const [IDcheckLoading, setIDcheckLoading] = useState(false);
  const [emailCheckLoading, setemailCheckLoading] = useState(false);
  const {
    values,
    handleChange,
    isSubmitting,
    errors,
    handleSubmit,
    setIsSubmitting,
    setErrors,
    setValues
  } = useFormInput(INITIAL_VALUES, validateRegisterForm, createUser);

  // useEffect(() => {
  //   setValues(INITIAL_VALUES);
  //   if (isLogin) {
  //     Router.push("/");
  //   }
  // }, [isLogin]);

  // 회원가입
  async function createUser() {
    const { email, password, nickname, location, selfIntro } = values;
    setIsSubmitting(true);

    try {
      await authFunctions.register(
        email,
        password,
        nickname,
        location,
        selfIntro
      );

      setValues(INITIAL_VALUES);
      Router.push("/");
    } catch (error) {
      // 중복 닉네임 & 이메일 에러처리
      console.error(error);
      const errorMessage = error.response.data;
      if (errorMessage.includes("닉네임")) {
        setErrors(prev => ({ ...prev, nickname: error.response.data }));
      } else if (errorMessage.includes("이메일")) {
        setErrors(prev => ({ ...prev, email: error.response.data }));
      }
      setIsSubmitting(false);
    }
  }

  // 중복 닉네임 확인
  const checkUniqueNickname = useCallback(async () => {
    if (values.nickname.length > 0) {
      try {
        setIDcheckLoading(true);
        const isAvailable = await authFunctions.checkDuplicateNickname(
          values.nickname
        );
        if (isAvailable) {
          toast.success("사용 가능한 닉네임 입니다.");
        } else {
          toast.warn("이미 사용 중인 닉네임 입니다.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIDcheckLoading(false);
      }
    } else {
      alert("닉네임을 입력하세요.");
    }
  }, [values.nickname]);

  const checkUniqueEmail = useCallback(async () => {
    if (values.email.length > 0) {
      try {
        setemailCheckLoading(true);
        const isAvailable = await authFunctions.checkDuplicateEmail(
          values.email
        );
        if (isAvailable) {
          toast.success("사용 가능한 이메일 입니다.");
        } else {
          toast.warn("이미 사용중인 이메일 입니다.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setemailCheckLoading(false);
      }
    } else {
      alert("이메일을 입력하세요.");
    }
  }, [values.email]);

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
            <Form.Field>
              <Input
                fluid
                name="nickname"
                icon="user"
                iconPosition="left"
                placeholder="닉네임"
                labelPosition="right"
                label={
                  <Button
                    onClick={checkUniqueNickname}
                    color="teal"
                    loading={IDcheckLoading}
                  >
                    중복확인
                  </Button>
                }
                type="text"
                value={values.nickname}
                onChange={handleChange}
              />
              <Message
                error={!errors.nickname}
                color="yellow"
                header={errors.nickname}
                size="mini"
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                name="email"
                label={
                  <Button
                    onClick={checkUniqueEmail}
                    color="teal"
                    loading={emailCheckLoading}
                  >
                    중복확인
                  </Button>
                }
                labelPosition="right"
                icon="mail"
                iconPosition="left"
                placeholder="이메일"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
              <Message
                error={!errors.email}
                color="yellow"
                header={errors.email}
                size="mini"
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="비밀번호"
                autoComplete="off"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
              <Message
                error={!errors.password}
                color="yellow"
                header={errors.password}
                size="mini"
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                name="passwordConfirm"
                icon="repeat"
                iconPosition="left"
                placeholder="비밀번호 재확인"
                type="password"
                value={values.passwordConfirm}
                onChange={handleChange}
              />
              <Message
                error={!errors.passwordConfirm}
                color="yellow"
                header={errors.passwordConfirm}
                size="mini"
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                name="location"
                labelPosition="right"
                icon="map marker alternate"
                iconPosition="left"
                placeholder="거주 지역"
                type="text"
                value={values.location}
                onChange={handleChange}
              />
            </Form.Field>

            <Form.Field>
              <TextArea
                name="selfIntro"
                placeholder="자기소개"
                type="text"
                value={values.selfIntro}
                onChange={handleChange}
              />
            </Form.Field>

            <Button
              color="teal"
              fluid
              size="large"
              compact
              loading={isSubmitting}
            >
              회원가입
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Register;
