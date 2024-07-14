export enum AppRoutesNames {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Statistics = 'statistics',
}

export const AppRoutes = {
  Auth: `/${AppRoutesNames.Auth}`,
  Dashboard: `/${AppRoutesNames.Dashboard}`,
  Statistics: `/${AppRoutesNames.Statistics}`,
};
