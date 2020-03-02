const model = {};
model.authUser = undefined;

model.loginSuccess = authUser => {
  model.authUser = authUser;
};

model.addMessage = async newMessage => {
  const db = firebase.firestore();

  db.collection("conversations")
    .doc(model.activeConversation.id)
    .update({
      messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
    });
};

model.loadConversations = async () => {
  const db = firebase.firestore();

  await db
    .collection("conversations")
    .where("users", "array-contains", model.authUser.email)
    .onSnapshot(async snapShot => {
      if (model.conversations === undefined) {
        const conversations = await snapShot.docChanges().map(item => ({
          id: item.doc.id,
          ...item.doc.data()
        }));

        //the same as (item) => {
        //     return {
        //         id: item.doc.id,
        //         ...item.doc.data(),
        //     }
        // }

        model.conversations = conversations;
        model.activeConversation = conversations[0];

        for (let message of model.activeConversation.messages) {
          view.addMessage(message);
        }

        for (let conversation of model.conversations) {
          view.addConversation(conversation);
        }

        for (let member of model.activeConversation.users) {
          view.addMember(member);
        }
      } else {
        for (const item of snapShot.docChanges()) {
          const conversation = {
            id: item.doc.id,
            ...item.doc.data()
          };

          if (item.type === "modified") {
            for (let i = 0; i < model.conversations.length; i++) {
              if (model.conversations[i].id === conversation.id) {
                if (
                  conversation.messages.length !==
                    model.conversations[i].messages.length &&
                  conversation.messages[conversation.messages.length - 1]
                    .user !== model.authUser.email
                ) {
                  model.conversations[i] = conversation;
                  console.log("model.conversations[i]", model.conversations[i]);
                  view.showNotification(conversation.id);
                } else if (
                  conversation.users.length !==
                  model.conversations[i].users.length
                ) {
                  model.conversations[i] = conversation;
                  view.showNotification(conversation.id);
                  console.log("model.conversations[i]", model.conversations[i]);
                }
              }
            }

            if (conversation.id === model.activeConversation.id) {
              console.log("conversation", conversation);
              console.log("model.activeConversation", model.activeConversation);
              if (
                conversation.messages.length !==
                model.activeConversation.messages.length
              ) {
                model.activeConversation = conversation;
                view.addMessage(
                  conversation.messages[conversation.messages.length - 1]
                );
              } else {
                model.activeConversation = conversation;
                view.addMember(
                  conversation.users[conversation.users.length - 1]
                );
              }
            }
          } else if (item.type === "added") {
            model.conversations.push(conversation);
            model.activeConversation = conversation;
            view.addConversation(conversation);
            view.showNotification(conversation.id);
          }
        }
      }
    });
};

model.changeActiveConversation = newActiveConversationId => {
  model.activeConversation = model.conversations.filter(
    item => item.id === newActiveConversationId
  )[0];
  view.changeActiveConversation();
};

model.createConversation = async newConversationObj => {
  const newConversation = {
    name: newConversationObj.conversationName,
    users: [model.authUser.email, newConversationObj.friendEmail],
    messages: [],
    createdAt: new Date().toISOString()
  };

  const db = firebase.firestore();
  db.collection("conversations").add(newConversation);
  view.backToChatScreen();
};

model.addMember = newMemberInfo => {
  const db = firebase.firestore();

  db.collection("conversations")
    .doc(model.activeConversation.id)
    .update({
      users: firebase.firestore.FieldValue.arrayUnion(newMemberInfo.newMember)
    });
  console.log("newMemberInfo.newMember", newMemberInfo.newMember);
};
