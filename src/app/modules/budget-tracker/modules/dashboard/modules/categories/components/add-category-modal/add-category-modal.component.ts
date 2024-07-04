import { Component, Inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetType, Category } from '@budget-tracker/data';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';
import { Observable, combineLatest, filter, map, take, tap } from 'rxjs';
import { AddCategoryModalData, CategoryIconForSelect, PredefinedCategoryIcons } from '../../models';
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

  readonly formFields = FormFields;

  readonly options = PredefinedCategoryIcons;

  readonly form: FormGroup = new FormGroup({
    [FormFields.CategoryIcon]: new FormControl(null, [Validators.required]),
    [FormFields.CategoryName]: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    [FormFields.CategoryColorPicker]: new FormControl('', [Validators.required]),
  });

  budgetType: BudgetType;

  title: string;

  loading$: Observable<boolean>;

  success$: Observable<boolean>;

  get selectedIcon(): string {
    return this.form.controls[FormFields.CategoryIcon].value?.icon;
  }

  get selectedIconTitle(): string {
    return this.form.controls[FormFields.CategoryIcon].value?.textTranslationKey;
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  get hasCategoryIconRequiredError(): boolean {
    return this.form.controls[FormFields.CategoryIcon].hasError('required');
  }

  get hasCategoryNameRequiredError(): boolean {
    return this.form.controls[FormFields.CategoryName].hasError('required');
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.CategoryName].hasError('maxlength');
  }

  get hasCategoryExistsError(): boolean {
    return this.form.controls[FormFields.CategoryName].hasError('categoryExists');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddCategoryModalData,
    private dialogRef: MatDialogRef<AddCategoryModalComponent>,
    private translateService: TranslateService,
    private categoriesFacade: CategoriesFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initDataAccordingToBudgetType();
    this.initListeners();
    this.subscribeToCategoryNameChanges();
  }

  setCategoryNameToInput(value: CategoryIconForSelect) {
    this.form.controls[FormFields.CategoryName].setValue(this.translateService.instant(value.textTranslationKey));
  }

  buildTranslationKey(key: string): string {
    return `dashboard.addCategoryModal.${key}`;
  }

  submitClick(): void {
    const category: Category = {
      icon: this.form.controls[FormFields.CategoryIcon].value.icon,
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
        this.title = this.buildTranslationKey(`${BudgetType.Income}.title`);
        this.categories$ = this.categoriesFacade.getIncomeCategories();
        break;

      case BudgetType.Expense:
        this.title = this.buildTranslationKey(`${BudgetType.Expense}.title`);
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
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }

  private subscribeToCategoryNameChanges(): void {
    combineLatest([this.categories$, this.form.controls[FormFields.CategoryName].valueChanges])
      .pipe(
        map(([categories, categoryName]) =>
          categories.map((category) => category.name.toLowerCase()).includes(categoryName.toLowerCase().trim())
        ),
        filter((shouldDisable) => !!shouldDisable),
        tap(() => this.form.controls[FormFields.CategoryName].setErrors({ categoryExists: true })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
