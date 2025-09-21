import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotsListComponent } from './snapshots-list.component';

describe('SnapshotsListComponent', () => {
  let component: SnapshotsListComponent;
  let fixture: ComponentFixture<SnapshotsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapshotsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnapshotsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
