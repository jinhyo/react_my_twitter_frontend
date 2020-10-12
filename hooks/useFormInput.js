import { useState, useEffect, useCallback } from "react";

// in <Register />
function useFormInput(initialState, validateFunc, cbFunc) {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  return {
    values,
    handleChange,
    isSubmitting,
    errors,
    setErrors,
    handleSubmit,
    setIsSubmitting,
    setValues
  };
}

export default useFormInput;
