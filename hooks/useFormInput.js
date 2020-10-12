import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import authFunctions from "../lib/authFunctions";

// in <Register />
function useFormInput(initialState, validateFunc, cbFunc) {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [IDcheckLoading, setIDcheckLoading] = useState(false);

  useEffect(() => {
    const errors = validateFunc(values);
    setErrors(errors);
  }, [values, validateFunc]);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      const noError = Object.keys(errors).length === 0;

      if (noError) {
        try {
          await cbFunc();
        } catch (error) {
          console.error(error);
          setErrors({ email: error.message });
          setIsSubmitting(false);
        }
      }
    },
    [errors]
  );

  const handleChange = useCallback(e => {
    e.persist();
    if (e.target.name === "selfIntro") {
      if (e.target.value.length < 50) {
        setValues(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      }
    } else {
      setValues(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  }, []);

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

  return {
    values,
    handleChange,
    isSubmitting,
    errors,
    setErrors,
    handleSubmit,
    setIsSubmitting,
    setValues,
    IDcheckLoading,
    checkUniqueNickname
  };
}

export default useFormInput;
