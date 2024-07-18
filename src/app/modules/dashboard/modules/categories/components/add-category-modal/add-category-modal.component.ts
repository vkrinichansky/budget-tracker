import { Component, Inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetType, Category } from '@budget-tracker/data';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { Observable, filter, take } from 'rxjs';
import { AddCategoryModalData } from '../../models';
import { CategoriesFacadeService } from '@budget-tracker/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum FormFields {
  CategoryIcon = 'categoryIcon',
  CategoryName = 'categoryName',
  CategoryColorPicker = 'categoryColorPicker',
}

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryModalComponent implements OnInit {
  private categories$: Observable<Category[]>;
  private categories: Category[];

  readonly formFields = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.CategoryIcon]: new FormControl(null),
    [FormFields.CategoryName]: new FormControl(null),
    [FormFields.CategoryColorPicker]: new FormControl(null),
  });

  readonly categoryExistsValidator = (value: string) =>
    this.categories
      .map((category) => category.name.toLowerCase().trim())
      .includes(value.toLowerCase().trim());

  budgetType: BudgetType;

  title: string;

  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddCategoryModalData,
    private dialogRef: MatDialogRef<AddCategoryModalComponent>,
    private categoriesFacade: CategoriesFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initDataAccordingToBudgetType();
    this.initListeners();
  }

  submitClick(): void {
    const category: Category = {
      icon: this.form.controls[FormFields.CategoryIcon].value,
      name: this.form.controls[FormFields.CategoryName].value,
      hexColor: this.form.controls[FormFields.CategoryColorPicker].value,
      value: 0,
      id: uuid(),
      budgetType: this.budgetType,
    };

    this.categoriesFacade.addCategory(category);
  }

  private initDataAccordingToBudgetType(): void {
    this.budgetType = this.data.budgetType;

    switch (this.budgetType) {
      case BudgetType.Income:
        this.title = `dashboard.addCategoryModal.${BudgetType.Income}.title`;
        this.categories$ = this.categoriesFacade.getIncomeCategories();
        break;

      case BudgetType.Expense:
        this.title = `dashboard.addCategoryModal.${BudgetType.Expense}.title`;
        this.categories$ = this.categoriesFacade.getExpenseCategories();
        break;
    }
  }

  private initListeners(): void {
    this.loading$ = this.categoriesFacade.getCategoryManagementInProgress();
    this.success$ = this.categoriesFacade.getCategoryManagementSuccess();

    this.success$
      .pipe(
        filter((isSuccess) => !!isSuccess),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.dialogRef.close());

    this.categories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => (this.categories = categories));
  }
}
