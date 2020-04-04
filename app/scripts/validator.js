window.Validator = function(formElement) {
  const form = document.querySelector(formElement);
  const fields = [];
  let isMounted = false;

  function init() {
    if (form) {
      isMounted = true;
      form.querySelectorAll('.form__field').forEach((field) => {
        const input = field.querySelector('.field__input');
        fields.push({
          fieldContainer: field,
          type: field.getAttribute('data-type') || input.type,
          input: input,
          validation: field.querySelector('.field__validation'),
          isValid: true,
        });
      });
    }
  }

  init();

  const validateText = (input) => {
    return input.value.length > 0;
  };

  const validateEmail = (input) => {
    // eslint-disable-next-line max-len
    const re = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(input.value);
  };

  const validateField = (field) => {
    switch (field.type) {
    case 'text':
      field.isValid = validateText(field.input);
      break;
    case 'email':
      field.isValid = validateEmail(field.input);
      break;
    default:
      validateText(field.input);
    }

    if (!field.isValid) {
      field.fieldContainer.classList.remove('is-valid');
      field.fieldContainer.classList.add('is-invalid');
    } else {
      field.fieldContainer.classList.remove('is-invalid');
      field.fieldContainer.classList.add('is-valid');
    }
    return field.isValid;
  };

  const validate = (cb) => {
    fields.forEach((field) => validateField(field));
    const isValid = fields.every((field) => field.isValid);
    console.log(isValid);
    cb(isValid);
  };

  return {
    validate: validate,
    isMounted: isMounted,
    form: form,
  };
};
