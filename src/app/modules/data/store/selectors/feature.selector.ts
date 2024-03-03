import { createFeatureSelector } from "@ngrx/store";
import { featureKey, DataFeatureState } from "../state";

export const dataFeatureSelector = createFeatureSelector<DataFeatureState>(featureKey);
