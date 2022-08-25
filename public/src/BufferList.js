import {LitElement, html, css} from '/lib/lit.min.js';
import "/src/ChatSender.js";

class SearchBar extends LitElement{
  static styles = css`
    .search-bar{
      padding: 16px 24px;
      width: 100%;
    }

    input{
      padding: 12px;
      background: rgba(0,0,0,.05);
      border-radius: 10px;
      outline:none;
      border: none;
      font-size: 16px;

      width: 100%;
      box-sizing: border-box;
    }

    input::placeholder{
      color: rgba(0,0,0,.35);
    }

    form{
      width: 100%;
      box-sizing: border-box;
    }

    h2.title{
      font-size: 30px;
      font-weight: bold;
      font-family: Helvetica,Arial, sans-serif;
      padding: 24px;
      margin-bottom: 0px;
    }
  `;

  submit(){
    const input = this.renderRoot.querySelector("input");
    const value = input.value;
    this.dispatchEvent(new CustomEvent("search", {
      detail: {value}
    }))
  }
  
  render(){
    return html`
    <h2 class="title">Chat</h2>
    <form action="javascript:void(0);" class="search-bar" @submit="${this.submit}">
      <input placeholder="Search"/>
    </form>
    `;
  }
}

class BufferList extends LitElement {
  static properties = {
    list: {type: Object},
    _filteredString: {type: String},
  };

  static styles = css`
  .buffer-list{
    height: 100vh;
    border-right: 1px solid rgba(0,0,0,0.35);
    display: flex;
    flex-direction: column;

    /* padding-bottom: 100px; */

    font-family: Helvetica, Arial, sans-serif;
    font-size: 18px;

    overflow-y: scroll;
    overflow-x: hidden;
  }
  .item{
    padding-left: 24px;
    min-height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: background 0.15s;
    margin: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    /* font-weight: bold; */
    /* border-bottom: 1px solid rgba(0,0,0,0.15); */
  }

  .item:hover{
    background: rgba(0,0,0,0.15);
  }

  search-bar{
    width: 100%;
    min-width: 100px;
  }

  `;

  selectBuffer(index){
    return function(){
      console.log(this.list[index])
      this.dispatchEvent(new CustomEvent("select", {
        detail:{
          id: this.list[index]
        }
      }));
    }.bind(this)
  }

  onSearch(e){
    const { value } = e.detail;
    this._filteredString = value;
  }

  constructor(){
    super();

    this.list = {};
    this._filteredString = "";
  }

  render(){
    console.log(this.list);
    return html`
    <div class="buffer-list" >
      <search-bar @search="${this.onSearch}"></search-bar>
      ${
        Object.keys(this.list).filter(e=>e.indexOf(this._filteredString)>-1).map((key)=>
          html`<div class="item" @click="${this.selectBuffer(key)}">${key || "(null)"}</div>`
      )}
      <div style="margin-bottom: 100px; width: 300px;"></div>
    </div>
    `;
  }
}

customElements.define("buffer-list", BufferList);
customElements.define("search-bar", SearchBar);