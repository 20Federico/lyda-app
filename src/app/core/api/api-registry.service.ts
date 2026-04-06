import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiConfig {
  baseUrl?: string;
  globalMock?: boolean;
  defaultDelayMs?: number;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint {
  key: string;
  method: HttpMethod;
  path: string; // es: /chats/:id
  mock?: { enabled: boolean; file: string; delayMs?: number };
}

@Injectable({ providedIn: 'root' })
export class ApiRegistryService {
  private config?: ApiConfig;

  constructor(private http: HttpClient) {}

  private readyResolve!: () => void;
  ready = new Promise<void>((resolve) => (this.readyResolve = resolve));

  async load(): Promise<void> {
    try {
      this.config = await firstValueFrom(this.http.get<ApiConfig>('/assets/endpoint.json'));
    } finally {
      // anche se fallisce, sblocchi la promise e non muore tutta l'app
      this.readyResolve();
    }
  }

  getConfig(): ApiConfig {
    if (!this.config) throw new Error('ApiRegistryService not loaded');
    return this.config;
  }

  match(method: string, url: string): ApiEndpoint | null {
    const cfg = this.getConfig();
    const m = method.toUpperCase() as HttpMethod;

    // togli baseUrl e query string
    const path = this.extractPath(url, cfg.baseUrl);

    for (const ep of cfg.endpoints) {
      if (ep.method !== m) continue;
      if (this.matchPath(ep.path, path)) return ep;
    }
    return null;
  }

  private extractPath(url: string, baseUrl?: string): string {
    let u = url;
    if (baseUrl && u.startsWith(baseUrl)) u = u.slice(baseUrl.length);
    u = u.split('?')[0];
    return u || '/';
  }

  private matchPath(template: string, actual: string): boolean {
    const tParts = template.split('/').filter(Boolean);
    const aParts = actual.split('/').filter(Boolean);
    if (tParts.length !== aParts.length) return false;

    for (let i = 0; i < tParts.length; i++) {
      const t = tParts[i];
      const a = aParts[i];
      if (t.startsWith(':')) continue;
      if (t !== a) return false;
    }
    return true;
  }
}
