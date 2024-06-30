export function getMonthAndYearString(date?: number): string {
  const newDate = date ? new Date(date) : new Date();

  return `${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
}

export function isPreviousMonth(date: number): boolean {
  return getMonthAndYearString() !== getMonthAndYearString(date);
}

export function getPreviousMonthTime(): number {
  const date = new Date();
  const previousMonth = new Date(date.getTime());
  previousMonth.setDate(0);

  return previousMonth.getTime();
}
