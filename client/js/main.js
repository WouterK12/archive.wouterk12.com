// test if already logged in
fetch("/token", {
  method: "GET",
  credentials: "include",
  redirect: "manual",
})
  .then((res) => {
    if (res.status != 200) throw res.status;
    window.location.href = `${window.location}archive`;
  })
  .catch((err) => {});

window.addEventListener("load", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");

  const errorMessage = document.getElementById("errorMessage");

  // log in
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      username: usernameField.value,
      password: passwordField.value,
    };

    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.status != 200) throw res.status;
        window.location.href = `${window.location}archive`;
      })
      .catch((err) => {
        switch (err) {
          case 400:
            errorMessage.innerText = "The username and password are required.";
            break;
          case 401:
            errorMessage.innerText = "Invalid username or password.";
            break;
          case 418:
            errorMessage.innerText = "That doesn't work cheese souffle.";
            break;
          default:
            errorMessage.innerText = "Something went wrong, try again later.";
            break;
        }
        errorMessage.style.display = "block";
      });
  });

  usernameField.addEventListener("keypress", () => {
    HideErrorMessage();
  });
  passwordField.addEventListener("keypress", () => {
    HideErrorMessage();
  });

  function HideErrorMessage() {
    errorMessage.style.display = "";
    errorMessage.innerText = "";
  }
});
