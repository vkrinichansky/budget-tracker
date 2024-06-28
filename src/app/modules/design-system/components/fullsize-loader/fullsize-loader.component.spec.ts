import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullsizeLoaderComponent } from './fullsize-loader.component';

describe('FullsizeLoaderComponent', () => {
  let component: FullsizeLoaderComponent;
  let fixture: ComponentFixture<FullsizeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullsizeLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullsizeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
