import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private readonly PASSWORD_MIN_LEN = 8;

  password = '';
  confirmPassword = '';

  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  private ui(fn: () => void): void {
    this.zone.run(() => {
      fn();
      this.cdr.detectChanges();
    });
  }

  async ngOnInit(): Promise<void> {
    // Se l'utente arriva qui senza sessione recovery, gli spieghiamo cosa fare
    try {
      const { data, error } = await this.supabase.client.auth.getSession();

      if (error) {
        this.ui(() => {
          this.error = 'Link non valido o scaduto. Richiedi di nuovo il reset password.';
        });
        return;
      }

      if (!data.session) {
        this.ui(() => {
          this.error = 'Per reimpostare la password, apri il link ricevuto via email.';
        });
      }
    } catch (e) {
      console.error('ResetPassword ngOnInit exception', e);
      this.ui(() => {
        this.error = 'Errore imprevisto. Riprova.';
      });
    }
  }

  get isResetDisabled(): boolean {
    const pwd = this.password.trim();
    const cpwd = this.confirmPassword.trim();
    return this.isLoading || pwd.length < this.PASSWORD_MIN_LEN || pwd !== cpwd;
  }

  onFormEnter(): void {
    if (this.isLoading) return;
    if (!this.isResetDisabled) void this.updatePassword();
  }

  async updatePassword(): Promise<void> {
    this.ui(() => {
      this.error = null;
      this.success = null;
      this.isLoading = true;
    });

    try {
      const pwd = this.password.trim();
      const cpwd = this.confirmPassword.trim();

      if (pwd.length < this.PASSWORD_MIN_LEN) {
        this.ui(() => {
          this.error = `La password deve avere almeno ${this.PASSWORD_MIN_LEN} caratteri.`;
        });
        return;
      }

      if (pwd !== cpwd) {
        this.ui(() => {
          this.error = 'Le password non coincidono.';
        });
        return;
      }

      const { error } = await this.supabase.updatePassword(pwd);

      if (error) {
        this.ui(() => {
          this.error = error.message || 'Errore durante l’aggiornamento password.';
        });
        return;
      }

      this.ui(() => {
        this.success = 'Password aggiornata correttamente. Ora puoi accedere.';
        this.password = '';
        this.confirmPassword = '';
      });

      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 600);
    } catch (e) {
      console.error('updatePassword exception', e);
      this.ui(() => {
        this.error = 'Errore imprevisto. Riprova.';
      });
    } finally {
      this.ui(() => {
        this.isLoading = false;
      });
    }
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/login');
  }
}
