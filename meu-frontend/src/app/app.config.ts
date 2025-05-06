import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { routes } from './app-routing.module';

export const API_URL = new InjectionToken<string>('API_URL');
export const apiUrlProvider = { provide: API_URL, useValue: 'http://localhost:8080' };

export const appConfig = [
  provideHttpClient(),
  provideRouter(routes),
  apiUrlProvider
];