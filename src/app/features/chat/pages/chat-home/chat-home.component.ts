import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideFolderClosed,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
  LucideSlidersHorizontal,
  LucideSquarePen,
  LucideFolderPlus,
  LucideEllipsis,
  LucideChevronDown,
  LucideChevronUp,
  LucidePin,
  LucideTrash2,
  LucidePencil,
  LucideShare,
  LucideFolderInput,
  LucideChevronRight,
  LucideMic,
} from '@lucide/angular';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { RouterLink } from '@angular/router';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

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
    LucideChevronDown,
    LucideChevronUp,
    LucideFolderPlus,
    LucideFolderClosed,
    LucidePin,
    LucideTrash2,
    LucidePencil,
    LucideShare,
    LucideFolderInput,
    LucideChevronRight,
    OverlayModule,
    LucideMic,
  ],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.scss',
})
export class ChatHomeComponent implements AfterViewInit {
  @ViewChild('promptTextarea') promptTextarea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;
  @ViewChildren('submenuPanel') submenuPanels?: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  prompt = '';
  selectedModel = 'gpt-4.1';
  isChatSidebarCollapsed = false;

  chatTitle = 'Nuova chat';

  attachedFiles: File[] = [];

  isProjectsOpen = true;
  isPastChatsOpen = true;

  projectsShowAll = false;
  readonly projectsPreviewLimit = 5;

  openChatMenuId: string | null = null;
  openMoveToProjectForChatId: string | null = null;
  moveTriggerHover = false;
  submenuHover = false;
  private closeSubmenuTimeout?: ReturnType<typeof setTimeout>;

  menuPositions: ConnectedPosition[] = [
    // preferito: menu a SINISTRA del trigger, allineato in alto
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8, offsetY: 0 },

    // fallback: a SINISTRA ma più in basso
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: -8,
      offsetY: 0,
    },

    // fallback estremo: a DESTRA (se per qualche motivo non c’è spazio a sinistra)
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8, offsetY: 0 },
  ];

  submenuPositions: ConnectedPosition[] = [
    // preferito: submenu a SINISTRA del “Move to project”
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8, offsetY: 0 },

    // fallback: sopra
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: -8,
      offsetY: 0,
    },

    // fallback: a destra
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8, offsetY: 0 },
  ];

  models = [
    { label: 'GPT-4.1', value: 'gpt-4.1' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'Claude Sonnet', value: 'claude-sonnet' },
  ];

  pastChats = [
    {
      title: 'Chat del 12/09/2024',
      id: 'chat-1',
    },
    {
      title: 'Roadmap MVP Lyda',
      id: 'chat-2',
    },
    {
      title: 'Architettura chat AI',
      id: 'chat-3',
    },
    {
      title: 'Idee widget task manager',
      id: 'chat-4',
    },
    {
      title: 'Flusso progetti condivisi',
      id: 'chat-5',
    },
    {
      title: 'Prompt engineering interno',
      id: 'chat-6',
    },
    {
      title: 'Roadmap MVP Lyda',
      id: 'chat-7',
    },
    {
      title: 'Architettura chat AI',
      id: 'chat-8',
    },
    {
      title: 'Idee widget task manager',
      id: 'chat-9',
    },
    {
      title: 'Flusso progetti condivisi',
      id: 'chat-10',
    },
    {
      title: 'Prompt engineering interno',
      id: 'chat-11',
    },
  ];

  projects = [
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

    // Chiudi sempre menu/overlay quando cambi stato sidebar
    this.closeChatItemMenu();
    this.closeMoveToProjectSubmenu();
  }

  toggleProjects(): void {
    this.isProjectsOpen = !this.isProjectsOpen;
  }

  togglePastChats(): void {
    this.isPastChatsOpen = !this.isPastChatsOpen;
  }

  get visibleProjects(): string[] {
    return this.projectsShowAll ? this.projects : this.projects.slice(0, this.projectsPreviewLimit);
  }

  get shouldShowProjectsToggle(): boolean {
    return this.projects.length > this.projectsPreviewLimit;
  }

  toggleProjectsList(): void {
    this.projectsShowAll = !this.projectsShowAll;
  }

  openMoveToProjectSubmenu(chatId: string): void {
    this.openMoveToProjectForChatId = chatId;
  }

  closeMoveToProjectSubmenu(): void {
    this.openMoveToProjectForChatId = null;
  }

  onCreateProject(): void {
    // TODO: creare nuovo progetto (backend + UI)
    this.closeChatItemMenu();
    this.closeMoveToProjectSubmenu();
    console.log('Create new project');
  }

  onCreateChat(): void {
    // TODO: creare nuova chat (backend + UI)
    console.log('Create new chat');
  }

  onMoveChatToProject(chatId: string, projectName: string): void {
    // TODO: spostare chat in progetto (backend + UI)
    this.closeChatItemMenu();
    this.closeMoveToProjectSubmenu();
    console.log('Move chat', chatId, 'to project', projectName);
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
    queueMicrotask(() => {
      this.autosize(true);
      this.scrollToBottom(true);
    });
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

  toggleChatItemMenu(chatId: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.openChatMenuId = this.openChatMenuId === chatId ? null : chatId;
  }

  closeChatItemMenu(): void {
    this.openChatMenuId = null;
    this.openMoveToProjectForChatId = null;
    this.submenuHover = false;
    this.clearCloseSubmenuTimeout();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeChatItemMenu();
  }

  // Actions (per ora stub)
  onChatShare(chatId: string): void {
    // TODO: implementare condivisione chat (backend + UI)
    this.closeChatItemMenu();
    console.log('Share', chatId);
  }

  onChatRename(chatId: string): void {
    // TODO: implementare ridenominazione chat (backend + UI)
    this.closeChatItemMenu();
    console.log('Rename', chatId);
  }

  onChatPin(chatId: string): void {
    // TODO: implementare pinning chat (backend + UI)
    this.closeChatItemMenu();
    console.log('Pin', chatId);
  }

  onChatDelete(chatId: string): void {
    // TODO: implementare eliminazione chat (backend + UI)
    this.closeChatItemMenu();
    console.log('Delete', chatId);
  }

  openChat(chat: any): void {
    // TODO: implementare apertura chat (backend + UI)
    console.log('Open chat', chat);
  }

  get submenuProjects(): string[] {
    return this.projects.slice(0, 8);
  }

  private scrollToBottom(smooth = true): void {
    const el = this.messagesContainer?.nativeElement;
    if (!el) return;

    // doppio RAF per essere sicuri che il nuovo messaggio sia già nel DOM e misurato
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const top = el.scrollHeight;

        if (smooth) {
          el.scrollTo({ top, behavior: 'smooth' });
        } else {
          el.scrollTop = top;
        }
      });
    });
  }

  onMoveTriggerEnter(chatId: string): void {
    this.clearCloseSubmenuTimeout();
    this.openMoveToProjectForChatId = chatId;
  }

  onMoveTriggerLeave(event: MouseEvent): void {
    const nextEl = event.relatedTarget as HTMLElement | null;

    // Se stai andando direttamente dentro il submenu, non chiudere
    if (nextEl && this.isInsideAnySubmenu(nextEl)) {
      return;
    }

    // Chiudi "quasi subito", ma dai il tempo all'hover del submenu di scattare
    this.clearCloseSubmenuTimeout();
    this.closeSubmenuTimeout = setTimeout(() => {
      if (!this.submenuHover) {
        this.openMoveToProjectForChatId = null;
      }
    }, 80);
  }

  onSubmenuEnter(): void {
    this.submenuHover = true;
    this.clearCloseSubmenuTimeout();
  }

  onSubmenuLeave(): void {
    this.submenuHover = false;
    this.openMoveToProjectForChatId = null;
  }

  private isInsideAnySubmenu(el: HTMLElement): boolean {
    const panels = this.submenuPanels?.toArray() ?? [];
    return panels.some((p) => p.nativeElement.contains(el));
  }

  private clearCloseSubmenuTimeout(): void {
    if (this.closeSubmenuTimeout) {
      clearTimeout(this.closeSubmenuTimeout);
      this.closeSubmenuTimeout = undefined;
    }
  }

  openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const newFiles = Array.from(input.files);

    const existingKeys = new Set(
      this.attachedFiles.map((f) => `${f.name}_${f.size}_${f.lastModified}`)
    );

    for (const f of newFiles) {
      const key = `${f.name}_${f.size}_${f.lastModified}`;
      if (!existingKeys.has(key)) {
        this.attachedFiles.push(f);
        existingKeys.add(key);
      }
    }

    // reset per poter riselezionare lo stesso file
    input.value = '';
  }

  removeFile(file: File): void {
    this.attachedFiles = this.attachedFiles.filter(
      (f) => !(f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)
    );
  }
}
