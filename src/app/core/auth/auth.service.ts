import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _session$ = new BehaviorSubject<Session | null>(null);
  readonly session$ = this._session$.asObservable();

  constructor(private supabase: SupabaseService) {
    // sessione iniziale
    this.supabase.client.auth.getSession().then(({ data }) => {
      this._session$.next(data.session ?? null);
    });

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
}
