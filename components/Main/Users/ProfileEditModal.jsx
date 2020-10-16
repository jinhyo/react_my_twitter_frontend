import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Button,
  Form,
  Input,
  Segment,
  TextArea,
  Message
} from "semantic-ui-react";
import { toast } from "react-toastify";

import useFormInput from "../../../hooks/useFormInput";
import validateEitProfileForm from "../../../lib/validateEitProfileForm";
import { userSelector, userActions } from "../../../features/userSlice";
import userFunctions from "../../../lib/userFunctions";
import { specificUserActions } from "../../../features/specificUserSlice";

const INITIAL_VALUES = {
  nickname: "",
  location: "",
  selfIntro: ""
};

// in <ProfileHeader />
function ProfileEditModal({ modal, closeModal }) {
  const dispatch = useDispatch();

  const userCardInfo = useSelector(userSelector.userCardInfo);

  useEffect(() => {
    INITIAL_VALUES.nickname = userCardInfo.nickname;
    INITIAL_VALUES.location = userCardInfo.location;
    INITIAL_VALUES.selfIntro = userCardInfo.selfIntro;
  }, [userCardInfo]);

  const {
    values,
    handleChange,
    isSubmitting,
    errors,
    handleSubmit,
    setIsSubmitting,
    setErrors,
    setValues,
    checkUniqueNickname,
    IDcheckLoading
  } = useFormInput(INITIAL_VALUES, validateEitProfileForm, editProfile);

  useEffect(() => {
    setErrors({});
    setValues(INITIAL_VALUES);
  }, [modal]);

  const notChangedNickname = useCallback(
    // 현재 내 닉네임이 바꼈는지 확인 (중복체크를 피하기 위해 사용)
    () => values.nickname === userCardInfo.nickname,
    [values.nickname]
  );

  async function editProfile() {
    const { nickname, location, selfIntro } = values;
    setIsSubmitting(true);

    try {
      await userFunctions.editProfile(nickname, selfIntro, location);
      setValues(INITIAL_VALUES);
      toast.success("수정 되었습니다.");

      dispatch(userActions.editProfile({ nickname, selfIntro, location }));
      dispatch(
        specificUserActions.editProfile({ nickname, selfIntro, location })
      );
      closeModal();
    } catch (error) {
      // 중복 닉네임 에러처리
      console.error(error);
      const errorMessage = error.response.data;
      if (errorMessage.includes("닉네임")) {
        setErrors(prev => ({ ...prev, nickname: error.response.data }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={modal} onClose={closeModal} size="tiny">
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        프로필 수정
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <Form>
          <Segment stacked>
            <Form.Field>
              <Input
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
                    disabled={notChangedNickname()}
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
          </Segment>
        </Form>
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        <Button inverted primary loading={isSubmitting} onClick={handleSubmit}>
          수정
        </Button>

        <Button inverted onClick={closeModal} color="red">
          취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ProfileEditModal;
