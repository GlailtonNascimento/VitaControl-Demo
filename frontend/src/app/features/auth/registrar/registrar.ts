import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css']
})
export class RegistrarComponent implements OnInit {
  registrarForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  hidePassword: boolean = true; // Controla a ocultação da senha

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrarForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registrarForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registrarForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Usuário cadastrado com sucesso!';
        console.log('Cadastro realizado com sucesso!', response);
        alert('Usuário cadastrado com sucesso!');
        
        // Redireciona para o login dentro das suas rotas
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no cadastro:', err);
        this.errorMessage = 'Erro ao realizar o cadastro. Verifique os dados.';
        alert(this.errorMessage);
      }
    });
  }

  // Alterna a visibilidade da senha (chamado pelo botão do olho no HTML)
  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
	

