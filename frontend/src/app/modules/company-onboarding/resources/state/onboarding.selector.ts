import { createSelector, createFeatureSelector } from "@ngrx/store";
import * as fromOnboarding from "./onboarding.reducer";

export const selectOnboardingEntity = createFeatureSelector<fromOnboarding.State>(
  fromOnboarding.onboardingFeatureKey
);
export const serverValidationErrorsSelector = createSelector(
  selectOnboardingEntity,
  fromOnboarding.serverErrors
);
export const registrationFormSelector = createSelector(
  selectOnboardingEntity,
  fromOnboarding.registrationForm,
);
export const businessTypeSelector = createSelector(
  selectOnboardingEntity,
  fromOnboarding.businessType,
);
export const onboardingStateSelector = createSelector(
  selectOnboardingEntity,
  fromOnboarding.onboardingState,
)
