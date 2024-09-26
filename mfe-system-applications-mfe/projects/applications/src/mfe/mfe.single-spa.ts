import { NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

import {
  getSingleSpaExtraProviders,
  singleSpaAngular,
} from 'single-spa-angular';

import {
  SingleSpaProps,
  singleSpaPropsSubject,
} from '../single-spa/single-spa-props';

import { AppComponent } from '../app/app.component';
import { getAppConfig } from '../app/app.config';

let $baseURL = '/';
let $appConfig: any = {};

function assetsUrl() {
  let url: string = $appConfig?.url || './';
  url.endsWith('/') || (url += '/');
  return url;
}

const singleSpaConfig = {
  bootstrapFunction: (singleSpaProps: SingleSpaProps) => {
    $baseURL = singleSpaProps.baseUrl || '/';
    $appConfig = singleSpaProps.appConfig;
    singleSpaPropsSubject.next(singleSpaProps);
    return getAppConfig(
      $baseURL,
      $appConfig.url || '/',
      getSingleSpaExtraProviders()
    ).then((appConfig) => {
      // load styles
      const styles = document.createElement('link');
      styles.rel = 'stylesheet';
      styles.href = `${assetsUrl()}styles.css`;
      styles.id = `styles-${$appConfig.name}`;
      document.head.appendChild(styles);

      return bootstrapApplication(AppComponent, appConfig);
    });
  },
  template: '<app-root />',
  Router,
  NavigationStart,
  NgZone,
};

const lifecycles = singleSpaAngular(singleSpaConfig);

const removeStyles = async () => {
  document.getElementById(`styles-${$appConfig.name}`)?.remove();
};

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = (Array.isArray(lifecycles.unmount) && [
  ...lifecycles.unmount,
  removeStyles,
]) || [lifecycles.unmount, removeStyles];
