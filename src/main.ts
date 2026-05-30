import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- GARANTA QUE APONTA PARA './app/app'

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

