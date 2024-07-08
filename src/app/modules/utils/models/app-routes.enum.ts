export enum AppRoutesNames {
  Auth = 'auth',
  BudgetTracker = 'budget-tracker',
  Dashboard = 'dashboard',
  Statistics = 'statistics',
}

export const AppRoutes = {
  BudgetTracker: `/${AppRoutesNames.BudgetTracker}`,
  Auth: `/${AppRoutesNames.Auth}`,
  Dashboard: `/${AppRoutesNames.BudgetTracker}/${AppRoutesNames.Dashboard}`,
  Statistics: `/${AppRoutesNames.BudgetTracker}/${AppRoutesNames.Statistics}`,
};
