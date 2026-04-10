import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';

type SettingsSection = 'account' | 'reminders' | 'models' | 'system' | 'about';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.scss',
})
export class SettingsHomeComponent implements OnInit {
  active: SettingsSection = 'account';

  // =========================
  // ACCOUNT
  // =========================
  account = {
    name: '',
    email: '',
    phone: '',
  };

  private originalAccount = { name: '', phone: '' };

  isAccountSaving = false;
  accountError: string | null = null;
  accountSuccess: string | null = null;

  // Change password (inline)
  isPasswordFormOpen = false;
  newPassword = '';
  confirmPassword = '';
  isPasswordSaving = false;
  passwordError: string | null = null;
  passwordSuccess: string | null = null;

  // Delete account (MVP stub)
  deleteInfo: string | null = null;

  // =========================
  // REMINDERS (mock for now)
  // =========================
  reminders = {
    enabled: true,
    defaultTime: '09:00',
    desktopNotifications: true,
    sound: false,
  };

  // =========================
  // MODELS (mock for now)
  // =========================
  models = {
    provider: 'openai',
    defaultModel: 'gpt-4.1',
    apiKey: '',
    temperature: 0.7,
  };

  // =========================
  // SYSTEM + APP (mock for now)
  // =========================
  system = {
    launchAtStartup: false,
    minimizeToTray: true,
    closeToTray: true,
    theme: 'system', // system | dark | light
  };

  app = {
    language: 'it',
    compactMode: false,
  };

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
    await this.loadAccount();
  }

  setActive(section: SettingsSection): void {
    this.active = section;
  }

  // =========================
  // ACCOUNT: LOAD / SAVE
  // =========================
  async loadAccount(): Promise<void> {
    this.ui(() => {
      this.accountError = null;
      this.accountSuccess = null;
      this.deleteInfo = null;
    });

    try {
      const { data, error } = await this.supabase.client.auth.getUser();
      if (error) {
        this.ui(() => (this.accountError = error.message));
        return;
      }

      const user = data.user;
      const meta: any = user.user_metadata ?? {};

      this.ui(() => {
        this.account.email = user.email ?? '';
        this.account.name = meta.full_name ?? '';
        this.account.phone = meta.phone ?? '';

        this.originalAccount = {
          name: this.account.name,
          phone: this.account.phone,
        };
      });
    } catch (e: any) {
      this.ui(() => (this.accountError = e?.message ?? 'Errore nel caricamento account.'));
    }
  }

  onAccountPhoneChange(value: string): void {
    // solo numeri, max 11
    const next = (value ?? '').replace(/\D/g, '').slice(0, 11);
    this.account.phone = next;
  }

  get isAccountSaveDisabled(): boolean {
    const name = this.account.name.trim();
    if (!name || name.length > 50) return true;

    const phone = (this.account.phone ?? '').trim();
    if (phone && (!/^\d+$/.test(phone) || phone.length > 11)) return true;

    const changed =
      name !== (this.originalAccount.name ?? '') || phone !== (this.originalAccount.phone ?? '');

    return this.isAccountSaving || this.isPasswordSaving || !changed;
  }

  async saveAccount(): Promise<void> {
    this.ui(() => {
      this.accountError = null;
      this.accountSuccess = null;
      this.isAccountSaving = true;
    });

    try {
      const name = this.account.name.trim();
      const phone = (this.account.phone ?? '').trim();

      if (!name) {
        this.ui(() => (this.accountError = 'Il nome è obbligatorio.'));
        return;
      }

      if (name.length > 50) {
        this.ui(() => (this.accountError = 'Il nome non può superare 50 caratteri.'));
        return;
      }

      if (phone && (!/^\d+$/.test(phone) || phone.length > 11)) {
        this.ui(() => (this.accountError = 'Telefono non valido (solo numeri, max 11 cifre).'));
        return;
      }

      const { error } = await this.supabase.client.auth.updateUser({
        data: {
          full_name: name,
          phone: phone || null,
        },
      });

      if (error) {
        this.ui(() => (this.accountError = error.message));
        return;
      }

      this.ui(() => {
        this.originalAccount = { name, phone };
        this.accountSuccess = 'Dati aggiornati correttamente.';
      });
    } catch (e: any) {
      this.ui(() => (this.accountError = e?.message ?? 'Errore nel salvataggio.'));
    } finally {
      this.ui(() => (this.isAccountSaving = false));
    }
  }

  // =========================
  // PASSWORD
  // =========================
  togglePasswordForm(): void {
    this.ui(() => {
      this.isPasswordFormOpen = !this.isPasswordFormOpen;
      this.passwordError = null;
      this.passwordSuccess = null;
      this.newPassword = '';
      this.confirmPassword = '';
    });
  }

  get isPasswordSaveDisabled(): boolean {
    const pwd = this.newPassword.trim();
    const cpwd = this.confirmPassword.trim();
    return this.isPasswordSaving || pwd.length < 8 || pwd !== cpwd;
  }

  async changePassword(): Promise<void> {
    this.ui(() => {
      this.passwordError = null;
      this.passwordSuccess = null;
      this.isPasswordSaving = true;
    });

    try {
      const pwd = this.newPassword.trim();
      const cpwd = this.confirmPassword.trim();

      if (pwd.length < 8) {
        this.ui(() => (this.passwordError = 'La password deve avere almeno 8 caratteri.'));
        return;
      }
      if (pwd !== cpwd) {
        this.ui(() => (this.passwordError = 'Le password non coincidono.'));
        return;
      }

      const { error } = await this.supabase.updatePassword(pwd);
      if (error) {
        this.ui(() => (this.passwordError = error.message));
        return;
      }

      this.ui(() => {
        this.passwordSuccess = 'Password aggiornata correttamente.';
        this.newPassword = '';
        this.confirmPassword = '';
      });
    } catch (e: any) {
      this.ui(() => (this.passwordError = e?.message ?? 'Errore durante il cambio password.'));
    } finally {
      this.ui(() => (this.isPasswordSaving = false));
    }
  }

  // =========================
  // LOGOUT
  // =========================
  async logout(): Promise<void> {
    try {
      await this.supabase.signOut();
    } finally {
      await this.router.navigateByUrl('/login');
    }
  }

  // =========================
  // DELETE ACCOUNT (stub)
  // =========================
  async deleteAccount(): Promise<void> {
    const ok = window.confirm('Sei sicuro? Questa azione è irreversibile.');
    if (!ok) return;

    this.ui(() => {
      this.deleteInfo =
        'Per eliminare davvero l’account serve una Edge Function (service role). Lo attiviamo nel prossimo step.';
    });

    // In futuro:
    // await this.supabase.client.functions.invoke('delete-account');
    // await this.logout();
  }

  // =========================
  // GENERIC SAVE (per ora)
  // =========================
  saveSection(section: SettingsSection): void {
    console.log('Save settings section:', section, {
      account: this.account,
      reminders: this.reminders,
      models: this.models,
      system: this.system,
      app: this.app,
    });
  }

  maskKey(key: string): string {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  }
}
