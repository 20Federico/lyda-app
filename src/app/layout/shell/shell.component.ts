import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
} from '@lucide/angular';
import { TooltipDirective } from '../../shared/directives/tooltip/tooltip.directive';

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
    TooltipDirective,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  isProfileMenuOpen = false;
  isSidebarCollapsed = false;

  user = {
    name: 'Federico',
    email: 'federico@example.com',
    title: 'Software Engineer',
  };

  constructor(private router: Router) {}

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

  onLogout(): void {
    this.isProfileMenuOpen = false;
    console.log('Logout');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeProfileMenu();
  }
}
