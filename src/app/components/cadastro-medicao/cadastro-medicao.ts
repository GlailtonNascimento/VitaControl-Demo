import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicaoService } from '../../services/medicao';

@Component({
  selector: 'app-cadastro-medicao',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-medicao.html',
  styleUrl: './cadastro-medicao.css'
})
export class CadastroMedicao {
  private medicaoService = inject(MedicaoService);

  // Objeto que espelha os campos do formulário HTML
  medicao = {
    sistolica: null,
    diastolica: null,
    pulsacao: null
  };

  salvar() {
    // Criamos o objeto completo com o que o Java espera receber no payload
    const dadosParaSalvar = {
      usuarioId: 1, // ID padrão provisório para o backend aceitar a gravação
      sistolica: this.medicao.sistolica,
      diastolica: this.medicao.diastolica,
      pulsacao: this.medicao.pulsacao,
      contexto: "Aplicativo Web"
    };

    this.medicaoService.salvar(dadosParaSalvar).subscribe({
      next: (resposta) => {
        alert('Medição salva com sucesso!');
        // Limpa o formulário após a gravação com sucesso
        this.medicao = {
          sistolica: null,
          diastolica: null,
          pulsacao: null
        };
      },
      error: (erro) => {
        console.error('Erro detalhado do backend:', erro);
        alert('Erro ao salvar a medição. Verifique o backend.');
      }
    });
  }
}


