window.addEventListener("load", () => {
  // refresh token
  var interval = setInterval(() => {
    fetch("/token", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status != 200) throw res.status;
      })
      .catch((err) => {
        Logout();
      });
  }, 5 * 60 * 1000); // 5m

  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", () => {
    Logout();
  });

  function Logout() {
    clearInterval(interval);
    fetch("/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        location.reload();
      })
      .catch((err) => {});
  }
});
