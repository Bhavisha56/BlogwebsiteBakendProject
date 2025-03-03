let formid = document.getElementById("formid");

formid.addEventListener("submit", function(event) {
    validation(event);
});

function validation(event) {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let isValid = true;

    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    // Reset previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    // Name validation (at least 3 characters)
    if (name.length < 3) {
        nameError.textContent = "Name must be at least 3 characters.";
        isValid = false;
    }

    // Email validation (basic format check)
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Enter a valid email address.";
        isValid = false;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    // Prevent form submission if validation fails
    if (!isValid) {
        event.preventDefault();
    }
}
