class Chatbox {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.chatbot__container'),
            sendButton: document.querySelector('.chatbot__send__btn button'),
            inputField: document.querySelector('.chatbot__input input')
        }
        this.messages = [];
    }

    display() {
        const {chatBox, sendButton, inputField} = this.args;

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))
        inputField.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    onSendButton(chatbox) {
        var textField = this.args.inputField;
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "user", message: text1 }
        this.messages.push(msg1);

        this.updateChatText(chatbox);
        textField.value = '';

        this.showTypingIndicator(chatbox);

        fetch('https://owlmentor.co/chat', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            this.removeTypingIndicator(chatbox);
            let msg2 = { name: "assistant", message: r.response };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
        }).catch((error) => {
            console.error('Error:', error);
            this.removeTypingIndicator(chatbox);
        });
    }

    showTypingIndicator(chatbox) {
        let typingIndicator = { name: "assistant", message: "Thinking..." };
        this.messages.push(typingIndicator);
        this.updateChatText(chatbox);
    }

    removeTypingIndicator(chatbox) {
        this.messages = this.messages.filter(msg => msg.message !== "Thinking...");
        this.updateChatText(chatbox);
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "assistant")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();