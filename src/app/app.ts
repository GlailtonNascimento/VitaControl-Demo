import { Component } from '@angular/core';
import { CadastroMedicao } from './components/cadastro-medicao/cadastro-medicao';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CadastroMedicao],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'VitaControl-Web';
}

