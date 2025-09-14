import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CategoryActions } from './category.actions';
import { Category } from '../models';

export interface CategoryState {
  categories: EntityState<Category>;
  isLoaded: boolean;
}

function selectCategoryId(category: Category) {
  return category.id;
}

export const categoryEntityAdapter = createEntityAdapter({
  selectId: selectCategoryId,
});

const initialState: CategoryState = {
  categories: categoryEntityAdapter.getInitialState({}),
  isLoaded: false,
};

const adapterReducer = createReducer(
  initialState,

  on(
    CategoryActions.categoriesLoaded,
    (state, action): CategoryState => ({
      ...state,
      categories: categoryEntityAdapter.upsertMany(action.categories, state.categories),
      isLoaded: true,
    })
  ),

  on(
    CategoryActions.categoryAdded,
    (state, action): CategoryState => ({
      ...state,
      categories: categoryEntityAdapter.addOne(action.category, state.categories),
    })
  ),

  on(
    CategoryActions.categoryRemoved,
    (state, action): CategoryState => ({
      ...state,
      categories: categoryEntityAdapter.removeOne(action.categoryId, state.categories),
    })
  ),

  on(
    CategoryActions.categoriesUpdated,
    (state, action): CategoryState => ({
      ...state,
      categories: categoryEntityAdapter.updateMany(
        action.updatedCategories.map((category) => ({
          changes: { value: category.value },
          id: category.id,
        })),
        state.categories
      ),
    })
  ),

  on(
    CategoryActions.categoriesReset,
    (state, action): CategoryState => ({
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

  on(CategoryActions.cleanState, (): CategoryState => initialState)
);

export function categoryReducer(state = initialState, action: Action): CategoryState {
  return adapterReducer(state, action);
}
