import { Routes } from '@angular/router';
import { TasksHome } from './features/tasks/pages/tasks-home/tasks-home';
import { ProjectsHome } from './features/projects/pages/projects-home/projects-home';
import { RemindersHome } from './features/reminders/pages/reminders-home/reminders-home';
import { SettingsHome } from './features/settings/pages/settings-home/settings-home';
import { ChatHomeComponent } from './features/chat/pages/chat-home/chat-home.component';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      { path: 'chat', component: ChatHomeComponent },
      { path: 'tasks', component: TasksHome },
      { path: 'projects', component: ProjectsHome },
      { path: 'reminders', component: RemindersHome },
      { path: 'settings', component: SettingsHome },
    ],
  },
];
