import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medicoes } from './medicoes';

describe('Medicoes', () => {
  let component: Medicoes;
  let fixture: ComponentFixture<Medicoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medicoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Medicoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
