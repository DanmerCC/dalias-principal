import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { appConfig } from './app.config';
import { ssrApiBaseInterceptor } from './interceptors/ssr-api-base.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Redeclara HttpClient SOLO en servidor para sumar el interceptor que
    // convierte las rutas relativas /api en absolutas (Node no tiene origen).
    provideHttpClient(withInterceptors([ssrApiBaseInterceptor]), withInterceptorsFromDi()),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
