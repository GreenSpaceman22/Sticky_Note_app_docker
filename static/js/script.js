const body_box = document.getElementById("body_box");
let current_user = "";
let users_notes = [];
paraMaker();
get_current_user(current_user);
function paraMaker() {
  let newTextBox = document.createElement("input");
  newTextBox.setAttribute("type", "text");
  newTextBox.setAttribute("class", "inputBox");
  newTextBox.setAttribute("placeholder", "enter your text here");
  body_box.appendChild(newTextBox);

  let submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.setAttribute("class", "submitBTN");
  body_box.appendChild(submitButton);

  submitButton.addEventListener("click", function () {
    let newSticky = document.createElement("div");
    const backGroundColor = getRandomHexColor();
    newSticky.style.background = backGroundColor;
    newSticky.style.fontSize = "larger";
    newSticky.style.display = "flex";
    newSticky.style.justifyContent = "space-around";
    newSticky.style.margin = "20px";
    newSticky.style.padding = "5px";
    let paragraph_container = document.getElementById("paragraph_container");
    paragraph_container.appendChild(newSticky);

    let newPara = document.createElement("p");
    newPara.setAttribute("id", "text_input");
    newPara.innerText = newTextBox.value;
    newPara.style.marginRight = "10px";
    newSticky.appendChild(newPara);
    sendMessage(current_user, newTextBox.value);

    let edit = document.createElement("button");
    edit.innerText = "Edit";
    edit.style.height = "fit-content";

    newSticky.appendChild(edit);

    edit.addEventListener("click", function () {
      let edit_input = document.createElement("input");
      edit_input.setAttribute("type", "text");
      edit_input.setAttribute("placeholder", "enter new post");
      edit_input.style.margin = "5px";
      edit_input.style.height = "fit-content";
      newSticky.appendChild(edit_input);
      let edit_submit = document.createElement("button");
      edit_submit.innerText = "submit";
      edit_submit.style.height = "fit-content";
      newSticky.appendChild(edit_submit);
      edit_submit.addEventListener("click", function () {
        newPara.innerText = edit_input.value;
        edit_submit.remove();
        edit_input.remove();
      });
    });
    let delete_button = document.createElement("button");
    delete_button.innerText = "X";
    delete_button.style.color = "red";
    delete_button.style.height = "fit-content";
    delete_button.style.marginLeft = "5px";
    delete_button.style.marginBottom = "5px";
    newSticky.appendChild(delete_button);
    delete_button.addEventListener("click", function () {
      delete_button.parentElement.remove();
    });

    newTextBox.value = "";
  });
}

function getRandomHexColor() {
  let hexChars = "0123456789ABCDEF";

  let randomColor = "#";

  for (let index = 0; index < 6; index++) {
    let randomHexCharIdx = Math.floor(Math.random() * hexChars.length);

    let randomHexChar = hexChars[randomHexCharIdx];

    randomColor += randomHexChar;
  }

  return randomColor;
}

function sendMessage(user_id, user_note) {
  let jsonMessage = {
    user_name: user_id,
    Note: user_note,
  };
  fetch(`http://127.0.0.1:5000/post_it`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(jsonMessage),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Deposited message:", data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_current_user(getting_user) {
  fetch("http://127.0.0.1:5000/load_user")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      getting_user = data.active_user;
      console.log("Data received:", data);
      current_user = data.active_user;
      //below for-each is HUGE. maintenance required.
      data.their_notes.forEach((note_from_user) => {
        users_notes.push(note_from_user);
        let newSticky = document.createElement("div");
        const backGroundColor = getRandomHexColor();
        newSticky.style.background = backGroundColor;
        newSticky.style.fontSize = "larger";
        newSticky.style.display = "flex";
        newSticky.style.justifyContent = "space-around";
        newSticky.style.margin = "20px";
        newSticky.style.padding = "5px";
        let paragraph_container = document.getElementById(
          "paragraph_container"
        );
        paragraph_container.appendChild(newSticky);

        let newPara = document.createElement("p");
        newPara.setAttribute("id", "text_input");
        newPara.innerText = note_from_user;
        newPara.style.marginRight = "10px";
        newSticky.appendChild(newPara);

        let edit = document.createElement("button");
        edit.innerText = "Edit";
        edit.style.height = "fit-content";

        newSticky.appendChild(edit);

        edit.addEventListener("click", function () {
          let edit_input = document.createElement("input");
          edit_input.setAttribute("type", "text");
          edit_input.setAttribute("placeholder", "enter new post");
          edit_input.style.margin = "5px";
          edit_input.style.height = "fit-content";
          newSticky.appendChild(edit_input);
          let edit_submit = document.createElement("button");
          edit_submit.innerText = "submit";
          edit_submit.style.height = "fit-content";
          newSticky.appendChild(edit_submit);
          edit_submit.addEventListener("click", function () {
            newPara.innerText = edit_input.value;
            edit_submit.remove();
            edit_input.remove();
          });
        });
        let delete_button = document.createElement("button");
        delete_button.innerText = "X";
        delete_button.style.color = "red";
        delete_button.style.height = "fit-content";
        delete_button.style.marginLeft = "5px";
        delete_button.style.marginBottom = "5px";
        newSticky.appendChild(delete_button);
        delete_button.addEventListener("click", function () {
          delete_button.parentElement.remove();
        });
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
