import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _session$ = new BehaviorSubject<Session | null>(null);
  readonly session$ = this._session$.asObservable();

  private readonly _ready$ = new BehaviorSubject<boolean>(false);
  readonly ready$ = this._ready$.asObservable();

  constructor(private supabase: SupabaseService) {
    this.init();
  }

  private async init(): Promise<void> {
    // sessione iniziale (restore da storage)
    const { data, error } = await this.supabase.client.auth.getSession();

    if (error) {
      // anche se errore, sblocchiamo lo stato "ready"
      console.error('AuthService getSession error:', error);
    }

    this._session$.next(data.session ?? null);
    this._ready$.next(true);

    // aggiornamenti (login/logout/refresh)
    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this._session$.next(session);
    });
  }

  get session(): Session | null {
    return this._session$.value;
  }

  get isAuthenticated(): boolean {
    return !!this._session$.value;
  }

  get isReady(): boolean {
    return this._ready$.value;
  }
}
