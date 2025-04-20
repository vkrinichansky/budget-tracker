import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CategoriesActions } from '../actions';
import { Category } from '@budget-tracker/models';

export interface CategoriesState {
  categories: EntityState<Category>;
  isLoaded: boolean;
}

function selectCategoryId(category: Category) {
  return category.id;
}

export const categoryEntityAdapter = createEntityAdapter({
  selectId: selectCategoryId,
});

const initialState: CategoriesState = {
  categories: categoryEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,

  on(
    CategoriesActions.categoriesLoaded,
    (state, action): CategoriesState => ({
      ...state,
      categories: categoryEntityAdapter.upsertMany(action.categories, state.categories),
      isLoaded: true,
    })
  ),

  on(
    CategoriesActions.categoryAdded,
    (state, action): CategoriesState => ({
      ...state,
      categories: categoryEntityAdapter.addOne(action.category, state.categories),
    })
  ),

  on(
    CategoriesActions.categoryRemoved,
    (state, action): CategoriesState => ({
      ...state,
      categories: categoryEntityAdapter.removeOne(action.categoryId, state.categories),
    })
  ),

  on(
    CategoriesActions.categoryValueChanged,
    (state, action): CategoriesState => ({
      ...state,
      categories: categoryEntityAdapter.updateOne(
        { changes: action.updatedCategory, id: action.updatedCategory.id },
        state.categories
      ),
    })
  ),

  on(
    CategoriesActions.categoriesReset,
    (state, action): CategoriesState => ({
      ...state,
      categories: categoryEntityAdapter.updateMany(
        action.categoriesIdsToReset.map((categoryId) => ({
          changes: { value: 0 },
          id: categoryId,
        })),
        state.categories
      ),
    })
  ),

  on(CategoriesActions.cleanState, (): CategoriesState => initialState)
);

export function categoriesReducer(state = initialState, action: Action): CategoriesState {
  return adapterReducer(state, action);
}
