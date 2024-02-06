import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BudgetType, Category } from '@budget-tracker/data';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';
import { Observable, combineLatest, filter, map, takeUntil, tap } from 'rxjs';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { AddCategoryModalData, CategoryIconForSelect, PredefinedCategoryIcons } from '../../models';
import { CategoriesFacadeService } from '@budget-tracker/data';

enum FormFields {
  CategoryIcon = 'categoryIcon',
  CategoryName = 'categoryName',
}

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class AddCategoryModalComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.addCategoryModal';

  private readonly destroy$ = injectUnsubscriberService();

  private categories$: Observable<Category[]>;

  readonly formFields = FormFields;

  readonly options = PredefinedCategoryIcons;

  readonly form: FormGroup = new FormGroup({
    [FormFields.CategoryIcon]: new FormControl(null, [Validators.required]),
    [FormFields.CategoryName]: new FormControl('', [Validators.required, Validators.maxLength(25)]),
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
    private categoriesFacade: CategoriesFacadeService
  ) {}

  ngOnInit(): void {
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

    this.loading$ = this.categoriesFacade.getCategoryManagementInProgress();
    this.success$ = this.categoriesFacade.getCategoryManagementSuccess();

    this.success$
      .pipe(
        takeUntil(this.destroy$),
        filter((isSuccess) => !!isSuccess)
      )
      .subscribe(() => this.dialogRef.close());

    this.subscribeToCategoryNameChanges();
  }

  setCategoryNameToInput(value: CategoryIconForSelect) {
    this.form.controls[FormFields.CategoryName].setValue(this.translateService.instant(value.textTranslationKey));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitClick(): void {
    const category: Category = {
      icon: this.form.controls[FormFields.CategoryIcon].value.icon,
      name: this.form.controls[FormFields.CategoryName].value,
      value: 0,
      id: uuid(),
      budgetType: this.budgetType,
    };

    this.categoriesFacade.addCategory(category);
  }

  private subscribeToCategoryNameChanges(): void {
    combineLatest([this.categories$, this.form.controls[FormFields.CategoryName].valueChanges])
      .pipe(
        map(([categories, categoryName]) =>
          categories.map((category) => category.name.toLowerCase()).includes(categoryName.toLowerCase().trim())
        ),
        filter((shouldDisable) => !!shouldDisable),
        tap(() => this.form.controls[FormFields.CategoryName].setErrors({ categoryExists: true })),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
