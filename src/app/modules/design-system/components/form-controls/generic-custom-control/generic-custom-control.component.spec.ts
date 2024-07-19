import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCustomControlComponent } from './generic-custom-control.component';

describe('GenericCustomControlComponent', () => {
  let component: GenericCustomControlComponent;
  let fixture: ComponentFixture<GenericCustomControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCustomControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericCustomControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
