import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideBell,
  LucideFolderOpen,
  LucideLogOut,
  LucideMail,
  LucideMessageSquare,
  LucideSettings,
  LucideSquareCheckBig,
} from '@lucide/angular';

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
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  isProfileMenuOpen = false;

  constructor(private router: Router) {}

  user = {
    name: 'Federico Molino',
    email: 'federico@example.com',
    title: 'Software Engineer',
  };

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
    this.router.navigate(['/login']);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeProfileMenu();
  }
}
