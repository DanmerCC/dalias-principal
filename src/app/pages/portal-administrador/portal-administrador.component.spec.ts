import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalAdministradorComponent } from './portal-administrador.component';

describe('PortalAdministradorComponent', () => {
  let component: PortalAdministradorComponent;
  let fixture: ComponentFixture<PortalAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
