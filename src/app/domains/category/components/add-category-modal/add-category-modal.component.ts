import { Component, Inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddCategoryModalData } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BudgetType } from '@budget-tracker/models';
import { ActionListenerService } from '@budget-tracker/utils';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { CategoryActions } from '../../store';
import { CategoryFacadeService } from '../../services';
import { Category } from '@budget-tracker/models';

enum FormFields {
  CategoryIcon = 'categoryIcon',
  CategoryName = 'categoryName',
  CategoryColorPicker = 'categoryColorPicker',
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

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: AddCategoryModalData,
    private readonly dialogRef: MatDialogRef<AddCategoryModalComponent>,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly actionListener: ActionListenerService,
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
        icon: this.form.controls[FormFields.CategoryIcon].value,
        name: this.form.controls[FormFields.CategoryName].value,
        hexColor: this.form.controls[FormFields.CategoryColorPicker].value,
        value: 0,
        id: uuid(),
        budgetType: this.budgetType,
        isSystem: false,
      };

      this.categoryFacade.addCategory(category);

      await this.actionListener.waitForResult(
        CategoryActions.categoryAdded,
        CategoryActions.addCategoryFail
      );

      this.dialogRef.close();
      this.snackbarHandler.showCategoryAddedSnackbar();
    } catch {
      this.snackbarHandler.showGeneralErrorSnackbar();
    } finally {
      this.loading$.next(false);
    }
  }

  private initData(): void {
    this.budgetType = this.data.budgetType;
    this.title = `dashboard.addCategoryModal.${this.budgetType}.title`;
    this.categories$ = this.categoryFacade.getCategoriesByType(this.budgetType);
  }

  private initListeners(): void {
    this.categories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => (this.categories = categories));
  }
}
