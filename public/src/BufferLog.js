import {LitElement, html, css} from '/lib/lit.min.js';

class BufferLog extends LitElement {
  static properties = {
    logs: {type: Array}
  }
  static styles = css`
  .chat-box{
    width: 100%;
    height: 100%;
    /* max-width: 100vw; */
    /* display: inline-flex; */
    /* flex-direction: column; */
    /* gap: 8px; */
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family:Helvetica, Arial, sans-serif;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .line.other{
    margin-right:auto;
    border-top-left-radius: var(--br);
    border-top-right-radius: var(--br);
    border-bottom-right-radius: var(--br);
    --bg: #e0e0e0;
    --txt: black;
  }

  .line.me{
    margin-left:auto;
    border-top-left-radius: var(--br);
    border-top-right-radius: var(--br);
    border-bottom-left-radius: var(--br);
    --bg: rgb(76, 145, 199);
    --txt: white;
  }

  .nickname{
    font-weight: bold;
    font-size: 14px;
    color: rgb(0,0,0);
    opacity: 0.75;
    margin-right: 16px;
  }

  .msg{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
  }

  .line{
    /* display: inline-flex; */
    --br: 20px;
    display: flex;
    flex-direction: column;
    background:var(--bg);

    word-wrap: normal;
    max-width: 50vw;

    padding: 10px 16px;
    margin-bottom: 16px;


    color: var(--txt);
    font-size: 16px;
    
    word-break: break-all;
  }

  .hint{
    margin: 16px auto;
    padding: 12px 16px;
    background: rgba(0,0,0,0.05);
    color: rgba(0,0,0,0.35);
    border-radius: 30px;
    word-break: break-all;
    box-sizing: border-box;
    font-size: 14px;
  }

  #load_content{
    margin: 16px auto;
    padding: 12px 16px;
    background: rgba(0,0,0,0.15);
    color: rgba(0,0,0,0.7);
    border-radius: 30px;
    cursor: pointer;
    transition: background 0.15s;
    border:none;
    outline: none;
    font-size: 16px;
  }

  #load_content:hover{
    background: rgba(0,0,0,0.35);
  }

  #load_content:active{
    background: rgba(0,0,0,0.55);
    /* color:white; */
  }
  `;

  constructor(){
    super();

    this.logs = [];
  }

  updated(){
    const cb = this.renderRoot.querySelector(".chat-box")
    cb.scrollTop = cb.scrollHeight;
    console.log("scroll")
  }

  render(){
    console.log(this.logs);
    return html`
    <div class="chat-box">
      <button id="load_content">Load more</button>
      ${this.logs.map(e=>{
        var msg = 
            e.nick.trim().indexOf("ljcucc") > -1 ? html`<div class="line me">${e.message}</div>`: null || 
            e.nick.trim().indexOf("fluffychan") > -1 ? html`<div class="line me">${e.message}</div>`: null || 

            (e.tags_array.indexOf("irc_notice") > -1 || 
             e.tags_array.indexOf('irc_join')>-1 ||
             e.tags_array.indexOf("irc_quit") > -1 || 
             e.nick.trim() == "*")?
              html`<div class="hint">${e.message}</div>`:null || 

            e.tags_array.indexOf('irc_privmsg')>-1?
              html`<div class="line other">
              <div class="nickname">${e.nick}</div>
                ${e.message}
              </div>`:null || "";

        return html`
          <div class="msg"> 
            ${msg}
          </div>
        `
      })}
      <!-- <div class="msg">
        <div class="line me">me me me me</div>
      </div> -->
    </div>
    `
  }
}

customElements.define("buffer-log", BufferLog);