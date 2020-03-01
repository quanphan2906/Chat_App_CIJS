const controller = {};
controller.register = async registerInfo => {
  if (!registerInfo.firstName) {
    view.setMessage("firstName-error", "Please input your first name");
  } else {
    view.setMessage("firstName-error", "");
  }

  if (!registerInfo.lastName) {
    view.setMessage("lastName-error", "Please input your last name");
  } else {
    view.setMessage("lastName-error", "");
  }

  if (!registerInfo.email) {
    view.setMessage("email-error", "Please input your email");
  } else {
    view.setMessage("email-error", "");
  }

  if (!registerInfo.password) {
    view.setMessage("password-error", "Please input your password");
  } else {
    view.setMessage("password-error", "");
  }

  if (
    !registerInfo.confirmPassword ||
    registerInfo.confirmPassword !== registerInfo.password
  ) {
    view.setMessage("confirmPassword-error", "Confirm password didn't match");
  } else {
    view.setMessage("confirmPassword-error", "");
  }

  if (
    registerInfo.firstName &&
    registerInfo.lastName &&
    registerInfo.email &&
    registerInfo.password &&
    registerInfo.confirmPassword == registerInfo.password
  ) {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(
          registerInfo.email,
          registerInfo.password
        );

      firebase.auth().currentUser.updateProfile({
        displayName: `${registerInfo.firstName} ${registerInfo.lastName}`
      });

      //Remember to write firebase.auth().currentUser.sendEmailVerification()
      //to verify users when host app
      view.setMessage("form-success", "Register success");
    } catch (error) {
      view.setMessage("form-error", error.message);
    }
  }
};

controller.login = async loginInfo => {
  if (!loginInfo.email) {
    view.setMessage("email-error", "Please input your email");
  } else {
    view.setMessage("email-error", "");
  }

  if (!loginInfo.password) {
    view.setMessage("password-error", "Please input your password");
  } else {
    view.setMessage("password-error", "");
  }

  if (loginInfo.email && loginInfo.password) {
    try {
      const loginResult = await firebase
        .auth()
        .signInWithEmailAndPassword(loginInfo.email, loginInfo.password);

      model.loginSuccess({
        uid: loginResult.user.uid,
        displayName: loginResult.user.displayName,
        email: loginResult.user.email
      });

      view.setActiveScreen("chat");
    } catch (error) {
      view.setMessage("form-error", error.message);
    }
  }
};

controller.addMessage = async newMessageContent => {
  const newMessage = {
    content: newMessageContent,
    user: model.authUser.email,
    createdAt: new Date().toISOString()
  };

  await model.addMessage(newMessage);
};

controller.changeActiveConversation = newActiveConversationId => {
  model.changeActiveConversation(newActiveConversationId);
};

controller.createConversation = newConversationObj => {
  if (!newConversationObj.conversationName) {
    view.setMessage(
      "conversation-name-error",
      "Please input conversation name"
    );
  } else {
    view.setMessage("conversation-name-error", "");
  }
  if (!newConversationObj.friendEmail) {
    view.setMessage("friend-email-error", "Please input your friends email");
  } else {
    view.setMessage("friend-email-error", "");
  }

  if (newConversationObj.conversationName && newConversationObj.friendEmail) {
    model.createConversation(newConversationObj);
  }
};

controller.addMember = newMemberInfo => {
  if (!newMemberInfo.newMember) {
    view.setMessage("member-email-error", "Please input new member's email");
  } else {
    view.setMessage("member-email-error", "");
  }

  if (newMemberInfo.newMember) {
    model.addMember(newMemberInfo);
  }
};
