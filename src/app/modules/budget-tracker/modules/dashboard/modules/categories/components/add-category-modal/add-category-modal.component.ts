import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddCategoryModalData } from '../../../../models';
import { BudgetType, Category, CategoryIconForSelect, PredefinedCategoryIcons } from '@budget-tracker/shared';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';
import { Observable, combineLatest, filter, map, takeUntil, tap } from 'rxjs';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { BudgetTrackerFacadeService } from '../../../../services';

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

  readonly options = PredefinedCategoryIcons;

  readonly form: FormGroup = new FormGroup({
    [FormFields.CategoryIcon]: new FormControl(null, [Validators.required]),
    [FormFields.CategoryName]: new FormControl('', [Validators.required, Validators.maxLength(25)]),
  });

  budgetType: BudgetType;

  title: string;

  loading$: Observable<boolean>;

  success$: Observable<boolean>;

  get selectedIcon(): boolean {
    return this.form.controls[FormFields.CategoryIcon].value?.icon;
  }

  get selectedIconTitle(): boolean {
    return this.form.controls[FormFields.CategoryIcon].value?.textTranslationKey;
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddCategoryModalData,
    private dialogRef: MatDialogRef<AddCategoryModalComponent>,
    private translateService: TranslateService,
    private btFacade: BudgetTrackerFacadeService
  ) {}

  ngOnInit(): void {
    this.budgetType = this.data.budgetType;

    switch (this.budgetType) {
      case BudgetType.Income:
        this.title = this.buildTranslationKey(`${BudgetType.Income}.title`);
        this.categories$ = this.btFacade.getIncomeCategories();
        break;

      case BudgetType.Expense:
        this.title = this.buildTranslationKey(`${BudgetType.Expense}.title`);
        this.categories$ = this.btFacade.getExpenseCategories();
        break;
    }

    this.loading$ = this.btFacade.getCategoryManagementInProgress();

    this.success$ = this.btFacade.getCategoryManagementSuccess();

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

    this.btFacade.addCategory(category);
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
