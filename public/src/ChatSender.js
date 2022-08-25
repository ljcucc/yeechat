import {LitElement, html, css} from '/lib/lit.min.js';
import "/src/components/IconButton.js";

class ChatSender extends LitElement {
  static properties = {
    _msg: {type: String}
  };

  static styles = css`
  .sender{
    width: 100%;
    display:flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 3vmin;
    box-sizing: border-box;
    height: 60px;

    gap: 4px;
  }

  input{
    max-height: 30px;
    padding: 12px 16px;
    border: 1px solid rgba(0,0,0,0.35);
    border-radius: 30px;
    outline: none;
    font-size:  16px;
    flex: 1;
  }
  `;

  constructor(){
    super();

    this._msg = "nan";
  }

  submit(){
    const input = this.renderRoot.querySelector("input");
    const value = input.value;
    input.value = "";

    this.dispatchEvent(new CustomEvent("send", {
      detail: {value}
    }))
  }

  render(){
    return html`
    <form action="javascript:void(0);" @submit=${this.submit} class="sender">
      <icon-button name="attach_file" id="send"></icon-button>
      <icon-button name="insert_emoticon" id="send"></icon-button>
      <input placeholder="What's on your mind?" type="text" />
      <icon-button name="send" id="send" @click="${this.submit}"></icon-button>
    </form>
    `
  }
}

customElements.define("chat-sender", ChatSender);