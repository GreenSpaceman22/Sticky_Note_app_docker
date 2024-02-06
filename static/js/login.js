log_in_btn.addEventListener("click", function () {
  console.log("in the log in");
  const body_box = document.getElementById("body_box");
  let current_user_log = document.getElementById("loguser");
  let logged_in = current_user_log.value;
  let active_user = document.createElement("h1");
  active_user.setAttribute("id", "current_user_logged");
  active_user.style.color = "white";
  if (logged_in != null || "") {
    active_user.innerText = logged_in;
  } else {
    console.log("This ain't it");
  }
  body_box.appendChild(active_user);
  let active_user_logged = active_user.innerText;
  sendUser(active_user_logged);
  return active_user_logged;
});

sign_up_btn.addEventListener("click", function () {
  const body_box = document.getElementById("body_box");
  let current_user_sign = document.getElementById("signuser");
  let signed_in = current_user_sign.value;

  let active_user = document.createElement("h1");
  active_user.setAttribute("id", "current_user_signed");
  if (signed_in != null || "") {
    active_user.innerText = signed_in;
  } else {
    console.log("This ain't it");
  }

  body_box.appendChild(active_user);
  let active_user_signedIn = active_user.innerText;
  sendUser(active_user_signedIn);
  return active_user_signedIn;
});

function sendUser(current_user) {
  const user_id = { active_user: current_user };
  fetch(`http://localhost:5000/get_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user_id),
  })
    .then((response) => response.json())
    .then((responsestate) => console.log(responsestate))
    .catch((err) => {
      console.log(current_user);
      console.log(err);
    });
}
