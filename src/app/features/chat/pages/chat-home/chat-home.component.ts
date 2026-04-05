import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.scss',
})
export class ChatHomeComponent {
  prompt = '';
  selectedModel = 'gpt-4.1';

  chatTitle = 'Nuova chat';

  models = [
    { label: 'GPT-4.1', value: 'gpt-4.1' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'Claude Sonnet', value: 'claude-sonnet' },
  ];

  pastChats = [
    'Roadmap MVP Lyda',
    'Architettura chat AI',
    'Idee widget task manager',
    'Flusso progetti condivisi',
    'Prompt engineering interno',
  ];

  messages = [
    {
      role: 'assistant',
      content: 'Ciao. Sono Lyda. Dimmi su cosa vuoi lavorare.',
    },
  ];

  sendMessage(): void {
    const trimmedPrompt = this.prompt.trim();

    if (!trimmedPrompt) return;

    this.messages.push({
      role: 'user',
      content: trimmedPrompt,
    });

    this.prompt = '';
  }
}
