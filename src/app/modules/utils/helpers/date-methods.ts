export function getMonthAndYearString(date?: number): string {
  const newDate = date ? new Date(date) : new Date();

  return `${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
}

export function getPreviousMonthTime(): number {
  const date = new Date();
  const previousMonth = new Date(date.getTime());
  previousMonth.setDate(0);

  return previousMonth.getTime();
}

export function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
