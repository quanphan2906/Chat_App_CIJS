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

      document
        .getElementById("create-conversation")
        .addEventListener("click", e => {
          view.setActiveScreen("createConversation");
        });

      document.getElementById("message-input").addEventListener("click", () => {
        view.removeNotification(model.activeConversation.id);
      });

      const addMemberForm = document.getElementById("add-member-form");
      console.log(
        "document.getElementById('add-member-form')",
        document.getElementById("add-member-form")
      );
      console.log("addMemberForm", addMemberForm);
      addMemberForm.addEventListener("submit", e => {
        e.preventDefault();

        controller.addMember({
          newMember: addMemberForm.memberEmail.value
        });

        addMemberForm.memberEmail.value = "";
      });
      break;
    case "createConversation":
      document.getElementById("app").innerHTML = components.createConversation;

      document
        .getElementById("cancel-create-conversation")
        .addEventListener("click", e => {
          view.backToChatScreen();
        });

      const createConversationForm = document.getElementById(
        "create-conversation-form"
      );
      createConversationForm.addEventListener("submit", e => {
        e.preventDefault();

        const conversationName = createConversationForm.conversationName.value;
        const friendEmail = createConversationForm.friendEmail.value;

        controller.createConversation({
          conversationName,
          friendEmail
        });
      });
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

  const conversationNoti = document.createElement("span");
  conversationNoti.classList.add("notification");
  conversationNoti.innerText = "new";
  conversationContainer.appendChild(conversationNoti);

  if (conversationObj.id === model.activeConversation.id) {
    conversationContainer.classList.add("selected-conversation");
  }

  conversationContainer.addEventListener("click", e => {
    view.removeNotification(conversationObj.id);
    controller.changeActiveConversation(conversationObj.id);
  });

  document
    .getElementById("conversation-list")
    .appendChild(conversationContainer);

  const mediaQueryResult = window.matchMedia("screen and (max-width: 768px)");
  if (mediaQueryResult.matches) {
    const conversationElement = document.getElementById(conversationObj.id);
    const firstLetter = conversationObj.name.charAt(0).toUpperCase();
    conversationElement.firstChild.innerText = firstLetter;

    document.getElementById("create-conversation").innerText = "+";
  }
  //caution: addListener not addEventListener
  //listen if mediaQueryResult has changed, if changes and matches
  mediaQueryResult.addListener(mediaQuery => {
    if (mediaQuery.matches) {
      const conversationElement = document.getElementById(conversationObj.id);
      const firstLetter = conversationObj.name.charAt(0).toUpperCase();
      conversationElement.firstChild.innerText = firstLetter;

      document.getElementById("create-conversation").innerText = "+";
    } else {
      const conversationElement = document.getElementById(conversationObj.id);
      conversationElement.firstChild.innerText = conversationObj.name;

      document.getElementById("create-conversation").innerText =
        "+ New conversation";
    }
  });
};

view.changeActiveConversation = () => {
  document.getElementById("conversation-name").innerText =
    model.activeConversation.name;
  document
    .querySelector(".selected-conversation")
    .classList.remove("selected-conversation");
  //co khac gi document.getElementsByClassName("selected-conversation")[0] khong?
  document
    .getElementById(model.activeConversation.id)
    .classList.add("selected-conversation");
  document.getElementById("conversation-messages").innerHTML = "";
  for (let message of model.activeConversation.messages) {
    view.addMessage(message);
  }

  document.getElementById("member-list").innerHTML = "";
  for (let member of model.activeConversation.users) {
    view.addMember(member);
  }
};

view.backToChatScreen = () => {
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

  document
    .getElementById("create-conversation")
    .addEventListener("click", e => {
      view.setActiveScreen("createConversation");
    });

  //add conversation to conversation list
  for (let conversation of model.conversations) {
    view.addConversation(conversation);
  }

  //add messages to active conversation
  for (let message of model.activeConversation.messages) {
    view.addMessage(message);
  }

  //render member list
  for (let member of model.activeConversation.users) {
    view.addMember(member);
  }

  //add member form listener
  const addMemberForm = document.getElementById("add-member-form");
  console.log("addMemberForm", addMemberForm);
  addMemberForm.addEventListener("submit", e => {
    e.preventDefault();

    const newMemberEmail = addMemberForm.memberEmail.value;
    console.log("newMemberEmail", newMemberEmail);
    controller.addMember({
      newMember: newMemberEmail
    });

    addMemberForm.memberEmail.value = "";
  });
};

view.showNotification = conversationId => {
  const conversation = document.getElementById(conversationId);
  //conversation now points to the container
  //conversation.lastChild is the noti badge, as we have added it the last
  conversation.lastChild.style.display = "inline-block";
};

view.removeNotification = conversationId => {
  const conversation = document.getElementById(conversationId);
  conversation.lastChild.style.display = "none";
};

view.addMember = memberEmail => {
  const member = document.createElement("div");
  member.classList.add("member");
  member.innerHTML = `<i>#${memberEmail}</i>`;
  document.getElementById("member-list").appendChild(member);
};
