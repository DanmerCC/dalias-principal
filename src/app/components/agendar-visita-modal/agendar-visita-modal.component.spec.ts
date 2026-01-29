import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarVisitaModalComponent } from './agendar-visita-modal.component';

describe('AgendarVisitaModalComponent', () => {
  let component: AgendarVisitaModalComponent;
  let fixture: ComponentFixture<AgendarVisitaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarVisitaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarVisitaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
