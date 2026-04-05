import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { ChatHome } from './features/chat/pages/chat-home/chat-home';
import { TasksHome } from './features/tasks/pages/tasks-home/tasks-home';
import { ProjectsHome } from './features/projects/pages/projects-home/projects-home';
import { RemindersHome } from './features/reminders/pages/reminders-home/reminders-home';
import { SettingsHome } from './features/settings/pages/settings-home/settings-home';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      { path: 'chat', component: ChatHome },
      { path: 'tasks', component: TasksHome },
      { path: 'projects', component: ProjectsHome },
      { path: 'reminders', component: RemindersHome },
      { path: 'settings', component: SettingsHome },
    ],
  },
];
