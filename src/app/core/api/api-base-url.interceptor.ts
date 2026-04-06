import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { ApiRegistryService } from './api-registry.service';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  constructor(private registry: ApiRegistryService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // bypass config + mocks (public)
    if (req.url.endsWith('/endpoint.json') || req.url.includes('/mocks/')) {
      return next.handle(req);
    }

    return from(this.registry.ready).pipe(
      switchMap(() => {
        const cfg = this.registry.getConfig();
        const baseUrl = cfg.baseUrl;

        // Se non c'è baseUrl o l'url è già assoluto, non toccare
        if (!baseUrl || /^https?:\/\//i.test(req.url)) {
          return next.handle(req);
        }

        // Normalizza: "/chats" e "chats" devono diventare baseUrl + "/chats"
        const path = req.url.startsWith('/') ? req.url : `/${req.url}`;

        const cloned = req.clone({ url: `${baseUrl}${path}` });
        return next.handle(cloned);
      })
    );
  }
}
