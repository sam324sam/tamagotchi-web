import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetView } from './pet-view';

describe('PetView', () => {
  let component: PetView;
  let fixture: ComponentFixture<PetView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
