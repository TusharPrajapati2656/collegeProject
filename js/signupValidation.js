$(document).ready(function () {
  let hasSubmitted = false;

  const signupForm = $("#signup-form");
  if (signupForm.length === 0) return;

  const nameInput = signupForm.find("#full-name");
  const emailInput = signupForm.find("#email");
  const mobileInput = signupForm.find("#mobile");
  const passwordInput = signupForm.find("#password");
  const genderSelect = signupForm.find("#gender");
  const ageRadios = signupForm.find("input[name='ageEligibility']");
  const termsCheckbox = signupForm.find("#terms-conditions");

  // Attach live input sanitization
  FormValidators.setupLiveSanitization(signupForm);

  // Live validation listeners (Active only AFTER first submit attempt)
  nameInput.on("input blur", function () {
    if (hasSubmitted) FormValidators.validateName(signupForm);
  });

  emailInput.on("input blur", function () {
    if (hasSubmitted) FormValidators.validateEmail(signupForm);
  });

  mobileInput.on("input blur", function () {
    if (hasSubmitted) FormValidators.validateMobile(signupForm);
  });

  passwordInput.on("input blur", function () {
    if (hasSubmitted) FormValidators.validatePassword(signupForm, 4, 20);
  });

  genderSelect.on("change blur", function () {
    if (hasSubmitted) FormValidators.validateGender(signupForm);
  });

  ageRadios.on("change", function () {
    if (hasSubmitted) FormValidators.validateAge(signupForm);
  });

  termsCheckbox.on("change", function () {
    if (hasSubmitted) FormValidators.validateTerms(signupForm);
  });

  // Submit Handler
  signupForm.on("submit", function (event) {
    hasSubmitted = true;

    // Pre-submit sanitization
    nameInput.val(Sanitizer.cleanName(nameInput.val()));
    emailInput.val(Sanitizer.cleanEmail(emailInput.val()));
    mobileInput.val(Sanitizer.cleanMobile(mobileInput.val()));
    passwordInput.val(Sanitizer.cleanPassword(passwordInput.val()));

    // Run validations using shared FormValidators
    const isNameValid = FormValidators.validateName(signupForm);
    const isEmailValid = FormValidators.validateEmail(signupForm);
    const isMobileValid = FormValidators.validateMobile(signupForm);
    const isPasswordValid = FormValidators.validatePassword(signupForm, 4, 20);
    const isGenderValid = FormValidators.validateGender(signupForm);
    const isAgeValid = FormValidators.validateAge(signupForm);
    const isTermsValid = FormValidators.validateTerms(signupForm);

    const isFormValid =
      isNameValid &&
      isEmailValid &&
      isMobileValid &&
      isPasswordValid &&
      isGenderValid &&
      isAgeValid &&
      isTermsValid;

    if (!isFormValid) {
      event.preventDefault();
    }
  });

  // Reset Handler
  signupForm.on("reset", function () {
    hasSubmitted = false;
    FormValidators.clearFormErrors(signupForm);
  });
});
