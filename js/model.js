const model = {};
model.authUser = undefined;

model.loginSuccess = (authUser) => {
    model.authUser = authUser;
};

model.addMessage = async (newMessage) => {
    const db = firebase.firestore();

    console.log("model.activeConversation trong addMessage",model.activeConversation);
    db.collection('conversations').doc(model.activeConversation.id).update({
        messages: firebase.firestore.FieldValue.arrayUnion(newMessage),
    });
};

model.loadConversations = () => {
    const db = firebase.firestore();

    db.collection("conversations").where("users", "array-contains", model.authUser.email)
    .onSnapshot(async (snapShot) => {
        if (model.conversations === undefined){
            // console.log(snapShot);
            // for (let ele of snapShot.docs){
            //     console.log("Data of snapShot", ele.data());
            // }
            // for (let ele of snapShot.docChanges()){
            //     console.log("Data of snapshot.docChanges()",ele.doc.data());
            // }
            const conversations = await snapShot.docChanges().map((item) => ({ //data trong snapShot voi data trong docChanges() khac nhau nhu nao?
                id: item.doc.id,
                ...item.doc.data(),
            }));
            
            model.conversations = conversations;
            model.activeConversation = conversations[0]; //tai sao activeConversation lai la conversation[0]?

            console.log("conversations trong loadConversations", conversations);
            console.log("model.activeConversation", model.activeConversation);
            for(let message of model.activeConversation.messages){
                view.addMessage(message);
            }
        } else{
            for (const item of snapShot.docChanges()){
                const conversation = {
                    id: item.doc.id,
                    ...item.doc.data(),
                }

                for (let i = 0; i < model.conversations.length; i++) {
                    if (model.conversations[i].id === conversation.id){
                        model.conversations[i] = conversation;
                    }
                }

                if (conversation.id === model.activeConversation.id){
                    model.activeConversation = conversation;
                    view.addMessage(conversation.messages[conversation.messages.length-1]);
                }
            }
        }
    })

}