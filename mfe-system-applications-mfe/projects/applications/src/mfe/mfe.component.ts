import { bootstrapApplication } from '@angular/platform-browser';
import { getAppConfig } from '../app/app.config';
import { AppComponent } from '../app/app.component';
import { ApplicationRef } from '@angular/core';

const TAG = 'applications-app';

let $baseURL = '/';
let $appConfig: any = {};

function assetsUrl() {
  let url: string = $appConfig?.url || './';
  url.endsWith('/') || (url += '/');
  return url;
}

class ApplicationsAppElement extends HTMLElement {
  private applicationRef: ApplicationRef | undefined | void = undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `:host { display: flex; flex-direction: column; align-items: stretch; box-sizing: border-box; } ::slotted(*) { flex: 1 1 0; min-height: 0; min-width: 0;}`;
    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(document.createElement('slot'));

    console.log(
      `mounting React Application using baseUrl: ${$baseURL} and assetsUrl: ${$appConfig.url} `
    );

    getAppConfig($baseURL, $appConfig?.url).then((appConfig) => {
      this.innerHTML = `
      <link rel="stylesheet" href="${assetsUrl()}styles.css">
      <app-root></app-root>
      `;
      bootstrapApplication(AppComponent, appConfig)
        .catch((err) => console.error(err))
        .then((appRef) => {
          this.applicationRef = appRef;
        });
    });
  }

  disconnectedCallback() {
    this.applicationRef?.destroy();
    this.applicationRef = undefined;
  }

  onAfterLeave() {
    this.applicationRef?.destroy();
    this.applicationRef = undefined;
  }
}

// register web application;
customElements.get(TAG) || customElements.define(TAG, ApplicationsAppElement);

function getComponent(baseURL = '/', appConfig = {}) {
  console.log('Applications APP: getComponent', baseURL, appConfig);
  $baseURL = baseURL;
  $appConfig = appConfig;
  return TAG;
}

export { ApplicationsAppElement, getComponent, TAG };
export default TAG;

declare global {
  interface HTMLElementTagNameMap {
    [TAG]: ApplicationsAppElement;
  }
}
