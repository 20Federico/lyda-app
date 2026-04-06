import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MockModeService {
  private readonly LS_KEY = 'lyda.mockMode';

  // globale
  getGlobalMockEnabled(defaultValue = false): boolean {
    const raw = localStorage.getItem(this.LS_KEY);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw).global ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setGlobalMockEnabled(enabled: boolean): void {
    const current = this.readState();
    current.global = enabled;
    this.writeState(current);
  }

  // per endpoint
  isEndpointMockEnabled(endpointKey: string, defaultValue: boolean): boolean {
    const current = this.readState();
    const overrides = current.overrides ?? {};
    return overrides[endpointKey] ?? defaultValue;
  }

  setEndpointMockEnabled(endpointKey: string, enabled: boolean): void {
    const current = this.readState();
    current.overrides = current.overrides ?? {};
    current.overrides[endpointKey] = enabled;
    this.writeState(current);
  }

  private readState(): any {
    const raw = localStorage.getItem(this.LS_KEY);
    if (!raw) return { global: undefined, overrides: {} };
    try {
      return JSON.parse(raw);
    } catch {
      return { global: undefined, overrides: {} };
    }
  }

  private writeState(state: any): void {
    localStorage.setItem(this.LS_KEY, JSON.stringify(state));
  }
}
