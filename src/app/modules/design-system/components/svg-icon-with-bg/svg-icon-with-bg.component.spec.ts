import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconWithBgComponent } from './svg-icon-with-bg.component';

describe('SvgIconWithBgComponent', () => {
  let component: SvgIconWithBgComponent;
  let fixture: ComponentFixture<SvgIconWithBgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgIconWithBgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgIconWithBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
