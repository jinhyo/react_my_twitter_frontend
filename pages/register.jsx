import React, { useState, useEffect, useCallback } from "react";
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
import Layout from "./components/Layout/Layout";
import Router from "next/router";
import validateRegisterForm from "../lib/validateRegisterForm";
import useFormInput from "../hooks/useFormInput";
import { toast } from "react-toastify";

const INITIAL_VALUES = {
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  location: "",
  selfIntro: ""
};

function Register(props) {
  // const isLogin = useSelector(userSelector.isLogin);
  const [isLogin, setIsLogin] = useState(false);

  const [privateEmail, setPrivateEmail] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
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

  useEffect(() => {
    setValues(INITIAL_VALUES);
    if (isLogin) {
      Router.push("/");
    }
  }, [isLogin]);

  async function createUser() {
    const { email, password, nickname, location, selfIntro } = values;
    setIsSubmitting(true);
    const createdAt = new Date();

    //  TODO

    setIsSubmitting(false);
  }

  const handleEmailCheck = useCallback(() => {
    setPrivateEmail(prev => !prev);
  }, []);

  const checkUniqueNickname = useCallback(async () => {
    setCheckLoading(true);
    // const isAvailable = await firebase.checkUniqueNickname(values.nickname);

    // TO DO

    if (isAvailable) {
      toast.success("사용 가능한 닉네임 입니다.");
      setCheckLoading(false);
    } else {
      setErrors({ ...errors, nickname: "사용할 수 없는 닉네임 입니다." });
      setCheckLoading(false);
    }
  }, [values.nickname]);

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
                    loading={checkLoading}
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
                  <Checkbox
                    checked={privateEmail}
                    onChange={handleEmailCheck}
                    color="teal"
                    label="비공개"
                  />
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
