import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withViewTransitions()), provideAnimations(), provideHttpClient(withFetch()), MessageService, ConfirmationService]
};

