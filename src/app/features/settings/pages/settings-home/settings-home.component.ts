import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SettingsSection = 'account' | 'reminders' | 'models' | 'system' | 'about';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.scss',
})
export class SettingsHomeComponent {
  active: SettingsSection = 'account';

  // v1 mock state
  account = {
    name: 'Federico',
    email: 'federico@example.com',
  };

  reminders = {
    enabled: true,
    defaultTime: '09:00',
    desktopNotifications: true,
    sound: false,
  };

  models = {
    provider: 'openai',
    defaultModel: 'gpt-4.1',
    apiKey: '',
    temperature: 0.7,
  };

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

  setActive(section: SettingsSection): void {
    this.active = section;
  }

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
