import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario = { username: '', password: '' };
  errorMessage: string = '';
  loading: boolean = false;
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = 'Usuário ou senha incorretos.';
      }
    });
  }
}
