import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) bypass assets/mock/config
    if (req.url.includes('/mocks/') || req.url.endsWith('/endpoint.json')) {
      return next.handle(req);
    }

    // 2) opt-out per chiamate che non vuoi tracciare
    if (req.headers.has('X-Skip-Loader')) {
      return next.handle(req);
    }

    queueMicrotask(() => this.loading.show());
    // this.loading.show();

    return next.handle(req).pipe(finalize(() => queueMicrotask(() => this.loading.hide())));
  }
}
