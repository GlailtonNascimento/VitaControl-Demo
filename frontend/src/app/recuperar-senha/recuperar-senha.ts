import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css'
})
export class RecuperarSenha {
  recuperarForm: FormGroup;
  carregando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private fb: FormBuilder) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    const emailDigitado = this.recuperarForm.value.email;
    console.log('Enviando solicitação para o e-mail:', emailDigitado);

    // Simulação de envio (Até conectarmos o Backend em Java)
    setTimeout(() => {
      this.carregando = false;
      this.mensagemSucesso = 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.';
      this.recuperarForm.reset();
    }, 2000);
  }
}

