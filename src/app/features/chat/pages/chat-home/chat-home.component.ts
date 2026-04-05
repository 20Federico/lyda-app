import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideFolderClosed,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
  LucideSlidersHorizontal,
  LucideSquarePen,
  LucideFolderPlus,
  LucideEllipsis,
} from '@lucide/angular';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideSquarePen,
    LucidePanelLeftClose,
    LucidePanelLeftOpen,
    LucideSlidersHorizontal,
    LucideFolderClosed,
    TooltipDirective,
    RouterLink,
    LucideFolderPlus,
    LucideEllipsis,
  ],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.scss',
})
export class ChatHomeComponent implements AfterViewInit {
  @ViewChild('promptTextarea') promptTextarea?: ElementRef<HTMLTextAreaElement>;

  prompt = '';
  selectedModel = 'gpt-4.1';
  isChatSidebarCollapsed = false;

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

  ngAfterViewInit(): void {
    // Imposta l’altezza iniziale corretta (1 riga)
    queueMicrotask(() => this.autosize(true));
  }

  get isSendDisabled(): boolean {
    return this.prompt.trim().length === 0;
  }

  toggleChatSidebar(): void {
    this.isChatSidebarCollapsed = !this.isChatSidebarCollapsed;
  }

  sendMessage(): void {
    const trimmedPrompt = this.prompt.trim();
    if (!trimmedPrompt) return;

    this.messages.push({
      role: 'user',
      content: trimmedPrompt,
    });

    this.prompt = '';

    // Dopo che Angular ha aggiornato il DOM, resetta altezza
    queueMicrotask(() => this.autosize(true));
  }

  onPromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;

    const textarea = event.target as HTMLTextAreaElement;

    // Mac: Option = altKey | Win/Linux: Ctrl = ctrlKey
    if (event.ctrlKey || event.altKey) {
      event.preventDefault();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      this.prompt = this.prompt.substring(0, start) + '\n' + this.prompt.substring(end);

      queueMicrotask(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        this.autosize(); // <-- fondamentale per righe vuote / newline
      });

      return;
    }

    event.preventDefault();
    this.sendMessage();
  }

  // chiamato da (input)
  onPromptInput(): void {
    this.autosize();
  }

  /**
   * Autosize fino a 10 righe.
   * forceReset=true => torna a 1 riga (usato dopo invio e init).
   */
  protected autosize(forceReset = false): void {
    const textarea = this.promptTextarea?.nativeElement;
    if (!textarea) return;

    textarea.style.height = 'auto';

    if (forceReset) {
      textarea.style.overflowY = 'hidden';
      return;
    }

    const cs = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(cs.lineHeight);
    const paddingTop = parseFloat(cs.paddingTop);
    const paddingBottom = parseFloat(cs.paddingBottom);
    const borderTop = parseFloat(cs.borderTopWidth);
    const borderBottom = parseFloat(cs.borderBottomWidth);

    const maxHeight = lineHeight * 10 + paddingTop + paddingBottom + borderTop + borderBottom;

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }
}
