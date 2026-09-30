$(document).ready(function () {
  $("#login-form, #signup-form").on("submit", function (event) {
    event.preventDefault();

    // let currentForm = $(this)

    let mobileNumber = $("#mobile").val();
    let mobileError = $(".mobile-error");
    let mobileRegex = /^[6-9]\d{9}$/;
    let password = $("#password").val();
    let passError = $(".pass-error");
    let minLength = 4;
    let maxLength = 20;

    if (mobileNumber === "") {
      mobileError.text("Mobile number cannot be empty");
      mobileError.show();
    } else if (!mobileRegex.test(mobileNumber)) {
      mobileError.text("Invalid Mobile number");
      mobileError.show();
    } else {
      mobileError.hide();
    }

    if (password === "") {
      passError.text("Password cannot be empty");
      passError.show();
    } else if (password.length < minLength) {
      passError.text(`Password cannot be less that ${minLength}`);
      passError.show();
    } else if (password.length > maxLength) {
      passError.text(`Password cannot be less that ${maxLength}`);
      passError.show();
    } else {
      passError.hide();
    }
  });
});
