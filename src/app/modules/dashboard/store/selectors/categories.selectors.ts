import { createSelector } from '@ngrx/store';
import { dataFeatureSelector } from './feature.selector';
import { BudgetType } from '@budget-tracker/models';

const categoriesStateSelector = createSelector(
  dataFeatureSelector,
  (dataFeatureState) => dataFeatureState.categoriesState
);

const allCategoriesDictionarySelector = createSelector(
  categoriesStateSelector,
  (state) => state.categories.entities
);

const categoriesLoadedSelector = createSelector(categoriesStateSelector, (state) => state.isLoaded);

const allCategoriesSelector = createSelector(
  allCategoriesDictionarySelector,
  (categoriesDictionary) => Object.values(categoriesDictionary)
);

const selectCategoryByIdSelector = (categoryId: string) =>
  createSelector(
    allCategoriesDictionarySelector,
    (categoriesDictionary) => categoriesDictionary[categoryId]
  );

const categoriesByTypeSelector = (budgetType: BudgetType) =>
  createSelector(allCategoriesSelector, (allCategories) =>
    allCategories.filter((category) => category.budgetType === budgetType)
  );

const incomeValueSelector = createSelector(allCategoriesSelector, (categories) =>
  categories
    .filter((category) => category.budgetType === BudgetType.Income)
    .reduce((sum, category) => sum + category.value, 0)
);

const expenseValueSelector = createSelector(allCategoriesSelector, (categories) =>
  categories
    .filter((category) => category.budgetType === BudgetType.Expense)
    .reduce((sum, category) => sum + category.value, 0)
);

const areCategoriesAllResetSelector = (budgetType: BudgetType) =>
  createSelector(allCategoriesSelector, (categories) =>
    categories
      .filter((category) => category.budgetType === budgetType)
      .every((category) => category.value === 0)
  );

const currentMonthBalanceSelector = createSelector(
  incomeValueSelector,
  expenseValueSelector,
  (income, expense) => income - expense
);

export const CategoriesSelectors = {
  categoriesStateSelector,
  incomeValueSelector,
  expenseValueSelector,
  selectCategoryByIdSelector,
  allCategoriesSelector,
  allCategoriesDictionarySelector,
  areCategoriesAllResetSelector,
  currentMonthBalanceSelector,
  categoriesLoadedSelector,
  categoriesByTypeSelector,
};
