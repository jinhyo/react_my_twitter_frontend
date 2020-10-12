function validateEitProfileForm(values) {
  let errors = {};
  if (!values.nickname) {
    errors.nickname = "닉네임을 입력하세요.";
  } else {
    errors.nickname = "";
  }

  if (errors.nickname.length === 0) {
    errors = {};
  }

  return errors;
}

export default validateEitProfileForm;
