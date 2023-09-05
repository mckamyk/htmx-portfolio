import React from 'react';
import {createRoot} from 'react-dom/client'
import {html, LitElement} from 'lit';

class ReactWrapper extends LitElement {
  constructor(private component: React.FC) {
    super()
  }

  firstUpdated() {
    const el = React.createElement(this.component)
    const root = createRoot(this.container)
    root.render(el)
  }

  get container() {
    const el = this.shadowRoot?.querySelector("#container") as HTMLDivElement
    console.log(el)
    return el
  }

  render() {
    return html`<div id="container"></div>`
  }
}

export const registerComponent = (component: React.FC, name: `${string}-${string}`) => {
  class el extends ReactWrapper {
    constructor() {
      super(component)
    }
  }
  window.customElements.define(name, el)
}

