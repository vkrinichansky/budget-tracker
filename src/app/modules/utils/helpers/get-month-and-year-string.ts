export function getMonthAndYearString(): string {
  const newDate = new Date();
  return `${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
}
