import { Component, Inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddCategoryModalData } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetType } from '@budget-tracker/shared-models';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { CategoryFacadeService } from '../../services';
import { Category } from '../../models';
import { getErrorMessage } from '@budget-tracker/shared-utils';

enum FormFields {
  CATEGORY_ICON = 'categoryIcon',
  CATEGORY_NAME = 'categoryName',
  CATEGORY_COLOR_PICKER = 'categoryColorPicker',
}

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AddCategoryModalComponent implements OnInit {
  private categories$: Observable<Category[]>;
  private categories: Category[];

  readonly formFields = FormFields;
  readonly loading$ = new BehaviorSubject<boolean>(false);

  readonly form: FormGroup = new FormGroup({
    [FormFields.CATEGORY_ICON]: new FormControl(null),
    [FormFields.CATEGORY_NAME]: new FormControl(null),
    [FormFields.CATEGORY_COLOR_PICKER]: new FormControl(null),
  });

  readonly categoryExistsValidator = (value: string) =>
    this.categories
      .map((category) => category.name.toLowerCase().trim())
      .includes(value.toLowerCase().trim());

  budgetType: BudgetType;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: AddCategoryModalData,
    private readonly dialogRef: MatDialogRef<AddCategoryModalComponent>,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initListeners();
  }

  async submitClick(): Promise<void> {
    this.loading$.next(true);

    try {
      const category: Category = {
        icon: this.form.controls[FormFields.CATEGORY_ICON].value,
        name: this.form.controls[FormFields.CATEGORY_NAME].value,
        hexColor: this.form.controls[FormFields.CATEGORY_COLOR_PICKER].value,
        value: 0,
        id: uuid(),
        budgetType: this.budgetType,
        isSystem: false,
      };

      await this.categoryFacade.addCategory(category);

      this.dialogRef.close();
      this.snackbarHandler.showMessageSnackbar('messages.category.categoryAdded');
    } catch (error) {
      this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
    } finally {
      this.loading$.next(false);
    }
  }

  private initData(): void {
    this.budgetType = this.data.budgetType;
    this.title = `category.addCategoryModal.${this.budgetType}.title`;
    this.categories$ = this.categoryFacade.getCategoriesByType(this.budgetType);
  }

  private initListeners(): void {
    this.categories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => (this.categories = categories));
  }
}
