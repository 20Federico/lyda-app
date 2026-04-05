import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';

@Component({
  selector: 'app-chat-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './chat-settings.component.html',
  styleUrl: './chat-settings.component.scss',
})
export class ChatSettingsComponent {}
