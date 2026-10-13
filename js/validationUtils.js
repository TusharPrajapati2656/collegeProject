/**
 * Shared Validation and Sanitization Module
 * Reusable across Login, Signup, and other portal forms.
 */
(function (window, $) {
  "use strict";

  // ============================================================
  // 1. SANITIZATION TECHNIQUES (XSS prevention & data cleaning)
  // ============================================================
  const Sanitizer = {
    // Strip malicious script blocks and any HTML tags
    stripHTML: function (str) {
      if (typeof str !== "string") return "";
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]+>/g, "");
    },

    // Name: strip HTML/scripts, remove numbers and special characters, collapse spaces
    cleanName: function (str) {
      if (typeof str !== "string") return "";
      let clean = this.stripHTML(str);
      return clean
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    },

    // Filter name while typing (allows letters and spaces without trimming trailing space)
    filterNameInput: function (str) {
      if (typeof str !== "string") return "";
      let clean = this.stripHTML(str);
      return clean.replace(/[^a-zA-Z\s]/g, "").replace(/\s{2,}/g, " ");
    },

    // Email: strip HTML, remove spaces/illegal characters, normalize to lowercase
    cleanEmail: function (str) {
      if (typeof str !== "string") return "";
      let clean = this.stripHTML(str);
      return clean
        .replace(/[^a-zA-Z0-9.@_+-]/g, "")
        .trim()
        .toLowerCase();
    },

    // Mobile: extract digits only, remove leading country code 91 if 12 digits, max 10
    cleanMobile: function (str) {
      if (typeof str !== "string") return "";
      let digits = str.replace(/\D/g, "");
      if (digits.length === 12 && digits.startsWith("91")) {
        digits = digits.slice(2);
      }
      return digits.slice(0, 10);
    },

    // Password: strip null bytes, dangerous script/HTML tags, trim outer whitespace
    cleanPassword: function (str) {
      if (typeof str !== "string") return "";
      let clean = this.stripHTML(str);
      return clean.replace(/\0/g, "").trim();
    },

    // Gender: whitelist valid options
    cleanGender: function (val) {
      const allowed = ["male", "female", "other"];
      return allowed.includes(val) ? val : "";
    },

    // Age: whitelist valid radio options
    cleanAge: function (val) {
      const allowed = ["yes", "no"];
      return allowed.includes(val) ? val : "";
    }
  };

  // ============================================================
  // 2. REUSABLE FIELD VALIDATORS (Scoped to specific form instance)
  // ============================================================
  const FormValidators = {
    mobileRegex: /^[6-9]\d{9}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Reusable Mobile Validator (used by both Login and Signup)
    validateMobile: function (form) {
      const mobileInput = form.find("#mobile");
      const mobileError = form.find(".mobile-error");
      if (mobileInput.length === 0) return true;

      const rawVal = mobileInput.val();
      const cleanVal = Sanitizer.cleanMobile(rawVal);
      if (rawVal !== cleanVal) {
        mobileInput.val(cleanVal);
      }

      if (cleanVal === "") {
        mobileError.text("Mobile number cannot be empty").show();
        mobileInput.addClass("input-error");
        return false;
      } else if (cleanVal.length !== 10 || !this.mobileRegex.test(cleanVal)) {
        mobileError.text("Invalid mobile number (must be 10 digits starting with 6-9)").show();
        mobileInput.addClass("input-error");
        return false;
      } else {
        mobileError.text("").hide();
        mobileInput.removeClass("input-error");
        return true;
      }
    },

    // Reusable Password Validator (used by both Login and Signup)
    validatePassword: function (form, minLength = 4, maxLength = 20) {
      const passwordInput = form.find("#password");
      const passwordError = form.find(".pass-error");
      if (passwordInput.length === 0) return true;

      const password = Sanitizer.cleanPassword(passwordInput.val());

      if (password === "") {
        passwordError.text("Password cannot be empty").show();
        passwordInput.addClass("input-error");
        return false;
      } else if (password.length < minLength) {
        passwordError.text(`Password cannot be less than ${minLength} characters`).show();
        passwordInput.addClass("input-error");
        return false;
      } else if (password.length > maxLength) {
        passwordError.text(`Password cannot exceed ${maxLength} characters`).show();
        passwordInput.addClass("input-error");
        return false;
      } else {
        passwordError.text("").hide();
        passwordInput.removeClass("input-error");
        return true;
      }
    },

    // Full Name Validator (Signup)
    validateName: function (form) {
      const nameInput = form.find("#full-name");
      const nameError = form.find(".name-error");
      if (nameInput.length === 0) return true;

      const value = Sanitizer.cleanName(nameInput.val());

      if (value === "") {
        nameError.text("Name cannot be empty").show();
        nameInput.addClass("input-error");
        return false;
      } else if (value.length < 3) {
        nameError.text("Name must be at least 3 characters").show();
        nameInput.addClass("input-error");
        return false;
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        nameError.text("Name can only contain letters and spaces").show();
        nameInput.addClass("input-error");
        return false;
      } else {
        nameError.text("").hide();
        nameInput.removeClass("input-error");
        return true;
      }
    },

    // Email Validator (Signup)
    validateEmail: function (form) {
      const emailInput = form.find("#email");
      const emailError = form.find(".email-error");
      if (emailInput.length === 0) return true;

      const value = Sanitizer.cleanEmail(emailInput.val());

      if (value === "") {
        emailError.text("Email cannot be empty").show();
        emailInput.addClass("input-error");
        return false;
      } else if (!this.emailRegex.test(value)) {
        emailError.text("Please enter a valid email address").show();
        emailInput.addClass("input-error");
        return false;
      } else {
        emailError.text("").hide();
        emailInput.removeClass("input-error");
        return true;
      }
    },

    // Gender Validator (Signup)
    validateGender: function (form) {
      const genderSelect = form.find("#gender");
      const genderError = form.find(".gender-error");
      if (genderSelect.length === 0) return true;

      const value = Sanitizer.cleanGender(genderSelect.val());

      if (!value || value === "") {
        genderError.text("Please select a valid option").show();
        genderSelect.addClass("input-error");
        return false;
      } else {
        genderError.text("").hide();
        genderSelect.removeClass("input-error");
        return true;
      }
    },

    // Age Eligibility Validator (Signup)
    validateAge: function (form) {
      const ageError = form.find(".age-error");
      if (ageError.length === 0) return true;

      const rawAge = form.find("input[name='ageEligibility']:checked").val();
      const selectedAge = Sanitizer.cleanAge(rawAge);

      if (!selectedAge) {
        ageError.text("Please select age eligibility").show();
        return false;
      } else if (selectedAge === "no") {
        ageError.text("You must be 18 or above to create an account").show();
        return false;
      } else {
        ageError.text("").hide();
        return true;
      }
    },

    // Terms & Conditions Validator (Signup)
    validateTerms: function (form) {
      const termsCheckbox = form.find("#terms-conditions");
      const termsError = form.find(".terms-error");
      if (termsCheckbox.length === 0 || termsError.length === 0) return true;

      if (!termsCheckbox.is(":checked")) {
        termsError.text("You must accept the terms & conditions").show();
        return false;
      } else {
        termsError.text("").hide();
        return true;
      }
    },

    // Set up live sanitization listeners for any inputs present in form
    setupLiveSanitization: function (form) {
      const mobileInput = form.find("#mobile");
      const nameInput = form.find("#full-name");
      const emailInput = form.find("#email");
      const passwordInput = form.find("#password");

      if (mobileInput.length > 0) {
        mobileInput.on("input", function () {
          const raw = $(this).val();
          const clean = Sanitizer.cleanMobile(raw);
          if (raw !== clean) $(this).val(clean);
        });
      }

      if (nameInput.length > 0) {
        nameInput.on("input", function () {
          const raw = $(this).val();
          const filtered = Sanitizer.filterNameInput(raw);
          if (raw !== filtered) $(this).val(filtered);
        });
        nameInput.on("blur", function () {
          const raw = $(this).val();
          const clean = Sanitizer.cleanName(raw);
          if (raw !== clean) $(this).val(clean);
        });
      }

      if (emailInput.length > 0) {
        emailInput.on("blur", function () {
          const raw = $(this).val();
          const clean = Sanitizer.cleanEmail(raw);
          if (raw !== clean) $(this).val(clean);
        });
      }

      if (passwordInput.length > 0) {
        passwordInput.on("blur", function () {
          const raw = $(this).val();
          const clean = Sanitizer.cleanPassword(raw);
          if (raw !== clean) $(this).val(clean);
        });
      }
    },

    // Clear all errors and input-error classes for a given form
    clearFormErrors: function (form) {
      form.find(".error-text").text("").hide();
      form.find(".form-input, .form-select").removeClass("input-error");
    }
  };

  // Expose to global window
  window.Sanitizer = Sanitizer;
  window.FormValidators = FormValidators;

})(window, jQuery);
