$(document).ready(function () {
  let hasSubmitted = false;

  const loginForm = $("#login-form");
  if (loginForm.length === 0) return;

  const mobileInput = loginForm.find("#mobile");
  const passwordInput = loginForm.find("#password");

  // Attach live input sanitization
  FormValidators.setupLiveSanitization(loginForm);

  // Live validation listeners (Active only AFTER first submit attempt)
  mobileInput.on("input blur", function () {
    if (hasSubmitted) {
      FormValidators.validateMobile(loginForm);
    }
  });

  passwordInput.on("input blur", function () {
    if (hasSubmitted) {
      FormValidators.validatePassword(loginForm, 4, 20);
    }
  });

  // Submit Handler
  loginForm.on("submit", function (event) {
    hasSubmitted = true;

    // Pre-submit sanitization
    mobileInput.val(Sanitizer.cleanMobile(mobileInput.val()));
    passwordInput.val(Sanitizer.cleanPassword(passwordInput.val()));

    // Reusable validations
    const isMobileValid = FormValidators.validateMobile(loginForm);
    const isPasswordValid = FormValidators.validatePassword(loginForm, 4, 20);

    if (!isMobileValid || !isPasswordValid) {
      event.preventDefault();
    }
  });
});
