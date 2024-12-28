export const getStartOfWeek = (date: Date): Date => {
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diff);
  return startOfWeek;
};