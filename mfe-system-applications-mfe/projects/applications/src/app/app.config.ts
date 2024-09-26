import { ApplicationConfig, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationsApiToken } from './tokens';
import { APP_BASE_HREF } from '@angular/common';

function loadEnvironment(assetsPath: string): Promise<any> {
  assetsPath.endsWith('/') || (assetsPath += '/');
  return fetch(`${assetsPath}assets/environment.json`).then((response) =>
    response.json()
  );
}

export const getAppConfig = async (
  baseHref: string,
  assetsPath: string = '',
  providers: Array<Provider> = []
): Promise<ApplicationConfig> => {
  baseHref.endsWith('/') || (baseHref += '/');
  assetsPath = assetsPath || baseHref;
  const environment = await loadEnvironment(assetsPath);
  return {
    providers: [
      { provide: APP_BASE_HREF, useValue: baseHref },
      provideRouter(routes),
      provideHttpClient(),
      {
        provide: ApplicationsApiToken,
        useValue: environment.ApplicationsApi || '',
      },
      ...providers,
    ],
  };
};
