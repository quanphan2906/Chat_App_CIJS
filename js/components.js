const components = {};
components.register = `
    <div id="big-container">
        <div id="register-container" class="bg-color-white">
            <div class="margin-bot-24px" id="header">
                Chat App
            </div>
            <form action="" class="margin-left-24px flex-col" id="register-form">
                <div class="flex-row flex-space-between">

                    <div>
                        <input class="input" type="text" name="firstName" placeholder="First name" class="">
                        <div class="error" id="firstName-error"></div>
                    </div>

                    <div style="margin-left: 43px;">
                        <input class="input" type="text" name="lastName" placeholder="Last name">
                        <div class="error" id="lastName-error"></div>
                    </div>

                </div>

                <input class="input margin-top-12px" type="email" name="email" placeholder="email@gmail.com">
                <div class="error" id="email-error"></div>

                <input class="input margin-top-12px" type="password" name="password" placeholder="Password">
                <div class="error" id="password-error"></div>

                <input class="input margin-top-12px" type="password" name="confirmPassword" placeholder="Confirm password">
                <div class="error" id="confirmPassword-error"></div>
                
                <div class="flex-space-between">
                    <div id="already-have-account" class="margin-top-12px" style="margin-left: 1px;">Already have account? Login!</div>
                    <button class="button-primary btn center margin-top-12px" style="margin-right: 0px">Register</button>
                </div>
                
                <div class="margin-top-12px form-success" id="form-success"></div>
                <div class="margin-top-12px form-error" id="form-error"></div>
            </form>
        </div>
    </div>
`;

components.login = `
    <div id="big-container">
        <div id="login-container" class="bg-color-white">
            <div class="margin-bot-24px" id="header">
                Chat App
            </div>
            <form action="" class="margin-left-24px flex-col" id="login-form">
                <input class="input margin-top-12px" type="email" name="email" placeholder="email@gmail.com">
                <div class="error" id="email-error"></div>

                <input class="input margin-top-12px" type="password" name="password" placeholder="Password">
                <div class="error" id="password-error"></div>
                
                <div class="flex-space-between">
                    <div id="havent-had-account" class="margin-top-12px" style="margin-left: 1px;">Haven't had account? Register!</div>
                    <button class="button-primary btn center margin-top-12px" style="margin-right: 0px">Log in</button>
                </div>
            </form>
        </div>
    </div>
`;

components.chat = `
<div class='chat-container'>
  <div class='header'>
    Techkids Chat
  </div>

  <div class='main'>
    <div class="conversation-list" id="conversation-list">
        <div class="create-conversation">
            <button id="create-conversation" class="btn"> + New Conversation</button>
        </div>
    </div>

    <div class='conversation-detail'>
      <div id='conversation-name' class='conversation-header'>
        Techkids Chat
      </div>

      <div class='conversation-messages' id='conversation-messages'>
      </div>

      <form name='message-form' id='message-form'>
        <div class='conversation-input'>
          <input id='message-input' name='message' placeholder='Type a message ...'></input>
          <button class='button' type='submit'>Send</button>
        </div>
      <form>
    </div>
  </div>
</div>
`;

components.createConversation = `
<div class="create-conversation-container">
    <div class="header">
        Techkids Chat
    </div>

    <div class="main">
        <h3>Create new conversation</h3>
        <form id="create-conversation-form" class="conversation-form">
            <div>
                <input class="input" id="conversationName" name="conversationName" type="text" placeholder="Conversation name"></input>
                <div id="conversation-name-error" class="error"></div>
            </div>

            <div>
                <input class="input" id="friendEmail" name="friendEmail" type="text" placeholder="Friend email"></input>
                <div id="friend-email-error" class="error"></div>
            </div>

            <div>
                <button class="btn" type="submit" id="submit">Create</button>
                <button class="btn" id="cancel-create-conversation">Cancel</button>
            </div>
        </form>
    </div>
</div>
`;
