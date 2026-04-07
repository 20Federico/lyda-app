import { Routes } from '@angular/router';
import { TasksHome } from './features/tasks/pages/tasks-home/tasks-home';
import { ProjectsHome } from './features/projects/pages/projects-home/projects-home';
import { ChatHomeComponent } from './features/chat/pages/chat-home/chat-home.component';
import { ShellComponent } from './layout/shell/shell.component';
import { ChatSettingsComponent } from './features/chat/pages/chat-settings/chat-settings.component';
import { NotesHomeComponent } from './features/notes/pages/notes-home/notes-home.component';
import { SettingsHomeComponent } from './pages/settings/settings-home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { loginGuard } from './core/auth/login.guard';
import { authGuard } from './core/auth/auth.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      { path: 'chat', component: ChatHomeComponent },
      { path: 'chat-settings', component: ChatSettingsComponent },
      { path: 'tasks', component: TasksHome },
      { path: 'projects', component: ProjectsHome },
      { path: 'notes', component: NotesHomeComponent },
      { path: 'settings', component: SettingsHomeComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
