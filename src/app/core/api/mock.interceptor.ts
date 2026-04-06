import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, from, of, switchMap, delay as rxDelay } from 'rxjs';
import { ApiRegistryService } from './api-registry.service';
import { MockModeService } from './mock-mode.service';
import { HttpClient } from '@angular/common/http';

interface MockFileResponse<T = any> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    private registry: ApiRegistryService,
    private mockMode: MockModeService,
    private http: HttpClient
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // NON intercettare file statici (config + mocks)
    if (req.url.includes('/assets/')) {
      return next.handle(req);
    }

    return from(this.registry.ready).pipe(
      switchMap(() => {
        const cfg = this.registry.getConfig();
        const matched = this.registry.match(req.method, req.url);

        if (!matched?.mock) {
          return next.handle(req);
        }

        const globalEnabled = this.mockMode.getGlobalMockEnabled(cfg.globalMock ?? false);
        const endpointEnabled = this.mockMode.isEndpointMockEnabled(
          matched.key,
          matched.mock.enabled
        );

        const useMock = globalEnabled && endpointEnabled;
        if (!useMock) {
          return next.handle(req);
        }

        const delayMs = matched.mock.delayMs ?? cfg.defaultDelayMs ?? 0;

        return this.http.get<MockFileResponse>(`/assets/${matched.mock.file}`).pipe(
          switchMap((mock) => {
            const res = new HttpResponse({
              status: mock.status ?? 200,
              body: mock.body,
            });

            return delayMs > 0 ? of(res).pipe(rxDelay(delayMs)) : of(res);
          })
        );
      })
    );
  }
}
