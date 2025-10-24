import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryTransactionModalComponent } from './category-transaction-modal.component';

describe('CategoryTransactionModalComponent', () => {
  let component: CategoryTransactionModalComponent;
  let fixture: ComponentFixture<CategoryTransactionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryTransactionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
