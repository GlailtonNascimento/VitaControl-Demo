import { TestBed } from '@angular/core/testing';

import { Medicao } from './medicao';

describe('Medicao', () => {
  let service: Medicao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Medicao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
