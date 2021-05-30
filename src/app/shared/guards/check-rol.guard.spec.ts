import { TestBed } from '@angular/core/testing';

import { CheckRolGuard } from './check-rol.guard';

describe('CheckRolGuard', () => {
  let guard: CheckRolGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckRolGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
