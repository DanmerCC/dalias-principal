import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalDirectorComponent } from './portal-director.component';

describe('PortalDirectorComponent', () => {
  let component: PortalDirectorComponent;
  let fixture: ComponentFixture<PortalDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
