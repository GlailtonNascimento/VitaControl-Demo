import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMedicao } from './cadastro-medicao';

describe('CadastroMedicao', () => {
  let component: CadastroMedicao;
  let fixture: ComponentFixture<CadastroMedicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMedicao],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroMedicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
