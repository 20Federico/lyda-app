import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';

type LoginMode = 'signin' | 'signup' | 'forgot';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  mode: LoginMode = 'signin';

  email = '';
  password = '';

  // signup extra fields
  fullName = '';
  phone = '';

  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  private readonly PASSWORD_MIN_LEN = 8;
  private readonly FULLNAME_MAX_LEN = 50;
  private readonly PHONE_MAX_LEN = 11;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  private isPasswordValid(pwd: string): boolean {
    return (pwd ?? '').trim().length >= this.PASSWORD_MIN_LEN;
  }

  private isFullNameValid(name: string): boolean {
    const n = (name ?? '').trim();
    return n.length > 0 && n.length <= this.FULLNAME_MAX_LEN;
  }

  private isPhoneValid(phone: string): boolean {
    const p = (phone ?? '').trim();
    if (!p) return true; // opzionale
    return /^[0-9]+$/.test(p) && p.length <= this.PHONE_MAX_LEN;
  }

  setMode(mode: LoginMode): void {
    this.mode = mode;
    this.error = null;
    this.success = null;
    // non resetto email/password così non perdi input passando tra viste
  }

  private ui(fn: () => void): void {
    this.zone.run(() => {
      fn();
      // detectChanges è “brutale” ma perfetto per sbloccare questa situazione
      this.cdr.detectChanges();
    });
  }

  private mapAuthError(err: any): string {
    const msg = (err?.message ?? '').toLowerCase();

    if (msg.includes('invalid login credentials')) return 'Credenziali errate. Riprova.';
    if (msg.includes('email not confirmed'))
      return 'Email non confermata. Controlla la posta e verifica l’account.';
    if (msg.includes('user already registered')) return 'Esiste già un account con questa email.';
    if (msg.includes('password should be at least') || msg.includes('password is too short'))
      return 'Password troppo corta. Minimo 8 caratteri.';
    if (msg.includes('unable to validate email') || msg.includes('email address is invalid'))
      return 'Email non valida. Controlla e riprova.';

    return err?.message ?? 'Errore imprevisto. Riprova.';
  }

  async signIn(): Promise<void> {
    this.ui(() => {
      this.error = null;
      this.success = null;
      this.isLoading = true;
    });

    try {
      const { error } = await this.supabase.signIn(this.email, this.password);

      if (error) {
        this.ui(() => {
          this.error = this.mapAuthError(error);
        });
        return;
      }

      await this.router.navigateByUrl('/chat');
    } catch (e) {
      console.error('signIn exception', e);
      this.ui(() => {
        this.error = this.mapAuthError(e);
      });
    } finally {
      this.ui(() => {
        this.isLoading = false;
      });
    }
  }

  async signUp(): Promise<void> {
    // reset + loading ON
    this.ui(() => {
      this.error = null;
      this.success = null;
      this.isLoading = true;
    });

    try {
      if (!this.isFullNameValid(this.fullName)) {
        this.ui(() => {
          this.error = `Il nome è obbligatorio e non può superare ${this.FULLNAME_MAX_LEN} caratteri.`;
        });
        return;
      }

      if (!this.isPasswordValid(this.password)) {
        this.ui(() => {
          this.error = `La password deve avere almeno ${this.PASSWORD_MIN_LEN} caratteri.`;
        });
        return;
      }

      if (!this.isPhoneValid(this.phone)) {
        this.ui(() => {
          this.error = `Il numero di telefono deve contenere solo numeri e massimo ${this.PHONE_MAX_LEN} cifre.`;
        });
        return;
      }

      const { error } = await this.supabase.client.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            full_name: this.fullName.trim(),
            phone: this.phone.trim() || null,
          },
          emailRedirectTo: 'http://localhost:4200/login',
        },
      });

      if (error) {
        this.ui(() => {
          this.error = this.mapAuthError(error);
        });
        return;
      }

      // Success: torna a login e mostra messaggio
      this.ui(() => {
        this.mode = 'signin';
        this.password = '';
        this.success =
          'Account creato correttamente. Ti abbiamo inviato una mail: verifica l’indirizzo prima di fare login.';
      });
    } catch (e) {
      console.error('signUp exception', e);
      this.ui(() => {
        this.error = this.mapAuthError(e);
      });
    } finally {
      // loading OFF
      this.ui(() => {
        this.isLoading = false;
      });
    }
  }

  async sendResetEmail(): Promise<void> {
    this.ui(() => {
      this.error = null;
      this.success = null;
      this.isLoading = true;
    });

    try {
      const redirectTo = 'http://localhost:4200/reset-password';
      const { error } = await this.supabase.resetPassword(this.email, redirectTo);

      if (error) {
        this.ui(() => {
          this.error = this.mapAuthError(error);
        });
        return;
      }

      this.ui(() => {
        this.success = 'Ti ho inviato una mail per reimpostare la password. Controlla la posta.';
      });
    } catch (e) {
      console.error('sendResetEmail exception', e);
      this.ui(() => {
        this.error = this.mapAuthError(e);
      });
    } finally {
      this.ui(() => {
        this.isLoading = false;
      });
    }
  }

  get isSignInDisabled(): boolean {
    return this.isLoading || !this.email.trim() || !this.isPasswordValid(this.password);
  }

  get isSignUpDisabled(): boolean {
    return (
      this.isLoading ||
      !this.email.trim() ||
      !this.isFullNameValid(this.fullName) ||
      !this.isPasswordValid(this.password) ||
      !this.isPhoneValid(this.phone)
    );
  }

  get isForgotDisabled(): boolean {
    return this.isLoading || !this.email.trim();
  }

  onFormEnter(): void {
    if (this.isLoading) return;

    if (this.mode === 'signin') {
      if (!this.isSignInDisabled) void this.signIn();
      return;
    }

    if (this.mode === 'signup') {
      if (!this.isSignUpDisabled) void this.signUp();
      return;
    }

    if (this.mode === 'forgot') {
      if (!this.isForgotDisabled) void this.sendResetEmail();
    }
  }

  onPhoneChange(value: string): void {
    this.phone = (value ?? '').replaceAll(/\D/g, '').slice(0, 11);
  }

  blockNonNumeric(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowed.includes(event.key)) return;

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
