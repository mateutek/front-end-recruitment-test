window.Validator = function(formElement) {
  const form = document.querySelector(formElement);
  const fields = [];
  let isMounted = false;

  function init() {
    if (form) {
      isMounted = true;
      form.querySelectorAll('.form__field').forEach((field) => {
        const input = field.querySelector('.field__input');
        const fieldType = field.getAttribute('data-type');

        fields.push({
          fieldContainer: field,
          type: fieldType || input.type,
          input: input,
          validation: field.querySelector('.field__validation'),
          isValid: true,
        });

        if (fieldType === 'credit') {
          input.addEventListener('keyup', setCreditCardCompany);
        }
      });
    }
  }

  const setCreditCardCompany = (e) => {
    const first = e.target.value.charAt(0);
    const creditCompanies = {
      '2': 'mastercard',
      '3': 'american-express',
      '4': 'visa',
      '5': 'mastercard',
    };

    const parent = e.target.parentNode;
    const company = creditCompanies[first] ? creditCompanies[first] : 'generic';
    parent.setAttribute('data-credit-company', company);
  };

  init();

  const toDigits = (string) =>
    string
      .replace(/[^0-9]/g, '')
      .split('')
      .map(Number);

  const condTransform = (predicate, value, fn) => {
    if (predicate) {
      return fn(value);
    } else {
      return value;
    }
  };

  const doubleEveryOther = (current, idx) =>
    condTransform(idx % 2 === 0, current, (x) => x * 2);

  const reduceMultiDigitVals = (current) =>
    condTransform(current > 9, current, (x) => x - 9);
  const validateText = (input) => {
    return input.value.length > 0;
  };

  const validateEmail = (input) => {
    // eslint-disable-next-line max-len
    const re = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(input.value);
  };

  const validatePhone = (input) => {
    // eslint-disable-next-line max-len
    const re = RegExp(/((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/);
    return re.test(input.value);
  };

  const validateCreditCard = (input) => {
    const digits = toDigits(input.value);
    const total = digits
      .slice(0, -1)
      .reverse()
      .map(doubleEveryOther)
      .map(reduceMultiDigitVals)
      .reduce((current, accumulator) =>
        current + accumulator, digits[digits.length - 1]);
    return total % 10 === 0;
  };

  const validateCVV = (input) => {
    const re = RegExp(/^[0-9]{3,4}$/);
    return re.test(parseInt(input.value));
  };

  const validateExpirationDate = (input) => {
    const re = RegExp(/^(0[1-9]|1[012])\/[0-9]{2}$/);
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
    case 'tel':
      field.isValid = validatePhone(field.input);
      break;
    case 'credit':
      field.isValid = validateCreditCard(field.input);
      break;
    case 'cvv':
      field.isValid = validateCVV(field.input);
      break;
    case 'exp':
      field.isValid = validateExpirationDate(field.input);
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
    cb(fields.every((field) => field.isValid));
  };

  return {
    validate: validate,
    isMounted: isMounted,
    form: form,
  };
};
