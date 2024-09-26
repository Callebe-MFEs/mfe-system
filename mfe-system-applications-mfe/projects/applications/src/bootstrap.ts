import { bootstrapApplication } from '@angular/platform-browser';
import { getAppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const baseHref = document.querySelector('base')?.getAttribute('href') || '/';

getAppConfig(baseHref).then((appConfig) => {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
});
