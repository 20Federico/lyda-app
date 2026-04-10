import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideMail,
  LucideSettings,
  LucideLogOut,
  LucideMessageSquare,
  LucideSquareCheckBig,
  LucideFolderOpen,
  LucideBell,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
  LucideNotebookPen,
} from '@lucide/angular';
import { map } from 'rxjs/operators';
import { TooltipDirective } from '../../shared/directives/tooltip/tooltip.directive';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { AuthService } from '../../core/auth/auth.service';

type UiUser = {
  name: string;
  email: string;
};

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideMail,
    LucideSettings,
    LucideLogOut,
    LucideMessageSquare,
    LucideSquareCheckBig,
    LucideFolderOpen,
    LucideBell,
    LucidePanelLeftClose,
    LucidePanelLeftOpen,
    LucideNotebookPen,
    TooltipDirective,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  isProfileMenuOpen = false;
  isSidebarCollapsed = false;

  readonly user$ = this.auth.session$.pipe(
    map((session): UiUser => {
      const user = session?.user;
      const email = user?.email ?? '';
      const meta: any = user?.user_metadata ?? {};

      const nameFromMeta = (meta.full_name ?? meta.name ?? '').trim();
      const fallbackName = email ? email.split('@')[0] : 'Utente';

      return {
        name: nameFromMeta || fallbackName,
        email,
      };
    })
  );

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isProfileMenuOpen = false;
  }

  toggleProfileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  onSettings(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  async logout(): Promise<void> {
    this.isProfileMenuOpen = false;
    await this.supabase.signOut();
    await this.router.navigateByUrl('/login');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeProfileMenu();
  }
}
