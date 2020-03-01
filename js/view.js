const view = {};

view.setActiveScreen = screenName => {
  switch (screenName) {
    case "register":
      //mount register screen
      document.getElementById("app").innerHTML = components.register;

      //add event to already have account button
      document
        .getElementById("already-have-account")
        .addEventListener("click", e => {
          view.setActiveScreen("login");
        });

      //input validation
      const registerForm = document.getElementById("register-form");

      registerForm.addEventListener("submit", e => {
        e.preventDefault();

        const registerInfo = {
          firstName: registerForm.firstName.value,
          lastName: registerForm.lastName.value,
          email: registerForm.email.value,
          password: registerForm.password.value,
          confirmPassword: registerForm.confirmPassword.value
        };

        controller.register(registerInfo);
      });
      break;
    case "login":
      //mount login screen
      document.getElementById("app").innerHTML = components.login;

      //add event to havent had account
      document
        .getElementById("havent-had-account")
        .addEventListener("click", e => {
          view.setActiveScreen("register");
        });

      //input validation
      const loginForm = document.getElementById("login-form");
      loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const loginInfo = {
          email: loginForm.email.value,
          password: loginForm.password.value
        };

        controller.login(loginInfo);
      });
      break;
    case "chat":
      //mount chat screen
      document.getElementById("app").innerHTML = components.chat;

      //add message form listener
      const messageForm = document.getElementById("message-form");
      messageForm.addEventListener("submit", e => {
        e.preventDefault();

        const newMessage = messageForm.message.value;
        controller.addMessage(newMessage);

        messageForm.message.value = "";
      });

      model.loadConversations();
      break;
  }
};

view.setMessage = (elementId, message = "") => {
  document.getElementById(elementId).innerText = message;
};

view.addMessage = messageObject => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  const message = document.createElement("div");
  message.classList.add("message");
  message.innerText = messageObject.content;

  if (messageObject.user == model.authUser.email) {
    messageContainer.classList.add("your");
  } else {
    const sender = document.createElement("div");
    sender.classList.add("sender");
    sender.innerText = messageObject.user;
    messageContainer.appendChild(sender);
  }

  messageContainer.appendChild(message);
  document
    .getElementById("conversation-messages")
    .appendChild(messageContainer);
};

view.addConversation = conversationObj => {
  const conversationName = document.createElement("span");
  conversationName.innerText = conversationObj.name;

  const conversationContainer = document.createElement("div");
  conversationContainer.classList.add("conversation");
  conversationContainer.id = conversationObj.id;
  conversationContainer.appendChild(conversationName);

  if (conversationObj.id === model.activeConversation.id) {
    conversationContainer.classList.add("selected-conversation");
  }

  document
    .getElementById("conversation-list")
    .appendChild(conversationContainer);
};
