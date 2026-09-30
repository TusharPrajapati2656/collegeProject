$(document).ready(function () {
  $("#signup-form").on("submit", function () {
    let currentForm = $(this);

    let name = currentForm.find("#full-name").val().trim();
    let nameError = currentForm.find(".name-error");
    if (name === "") {
      nameError.text("Name cannot be empty");
      nameError.show();
    } else {
      nameError.hide();
    }

    let email = currentForm.find("#email").val().trim();
    let emailError = currentForm.find(".email-error");
    if (email === "") {
      emailError.text("Email cannot be empty");
      emailError.show();
    } else {
      emailError.hide();
    }

    let gender = currentForm.find("#gender").val();
    let genderError = currentForm.find(".gender-error");
    if (gender === null) {
      genderError.text("Gender cannot be empty");
      genderError.show();
    } else {
      genderError.hide();
    }


  });
});
