import { Routes } from '@angular/router';
import { TasksHome } from './features/tasks/pages/tasks-home/tasks-home';
import { ProjectsHome } from './features/projects/pages/projects-home/projects-home';
import { SettingsHomeComponent } from './features/settings/pages/settings-home/settings-home.component';
import { ChatHomeComponent } from './features/chat/pages/chat-home/chat-home.component';
import { ShellComponent } from './layout/shell/shell.component';
import { ChatSettingsComponent } from './features/chat/pages/chat-settings/chat-settings.component';
import { NotesHomeComponent } from './features/notes/pages/notes-home/notes-home.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      {
        path: 'chat',
        component: ChatHomeComponent,
        children: [{ path: 'settings', component: ChatSettingsComponent }],
      },
      { path: 'tasks', component: TasksHome },
      { path: 'projects', component: ProjectsHome },
      { path: 'notes', component: NotesHomeComponent },
      { path: 'settings', component: SettingsHomeComponent },
    ],
  },
];
