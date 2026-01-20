import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesDeEstadiaComponent } from './planes-de-estadia.component';

describe('PlanesDeEstadiaComponent', () => {
  let component: PlanesDeEstadiaComponent;
  let fixture: ComponentFixture<PlanesDeEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanesDeEstadiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanesDeEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
