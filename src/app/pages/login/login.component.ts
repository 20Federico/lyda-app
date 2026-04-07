import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  error: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async signIn(): Promise<void> {
    this.error = null;
    this.isLoading = true;

    const { error } = await this.supabase.signIn(this.email, this.password);

    this.isLoading = false;

    if (error) {
      this.error = error.message;
      return;
    }

    await this.router.navigateByUrl('/chat');
  }

  async signUp(): Promise<void> {
    this.error = null;
    this.isLoading = true;

    const { error } = await this.supabase.signUp(this.email, this.password);

    this.isLoading = false;

    if (error) {
      this.error = error.message;
      return;
    }

    // se hai email confirmation attiva, dovrà confermare prima di poter entrare
    await this.router.navigateByUrl('/chat');
  }
}
