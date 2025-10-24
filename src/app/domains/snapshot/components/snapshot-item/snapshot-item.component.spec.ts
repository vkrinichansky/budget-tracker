import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotItemComponent } from './snapshot-item.component';

describe('SnapshotItemComponent', () => {
  let component: SnapshotItemComponent;
  let fixture: ComponentFixture<SnapshotItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapshotItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnapshotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
