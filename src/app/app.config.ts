import {
  ApplicationConfig,
  provideAppInitializer,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { ApiRegistryService } from './core/api/api-registry.service';
import { MockInterceptor } from './core/api/mock.interceptor';
import { ApiBaseUrlInterceptor } from './core/api/api-base-url.interceptor';
import { LoadingInterceptor } from './core/api/ui/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // HttpClient + DI interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Load api.json before app bootstraps (replacement for APP_INITIALIZER)
    provideAppInitializer(() => inject(ApiRegistryService).load()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiBaseUrlInterceptor,
      multi: true,
    },
  ],
};
