export function formatDateToYears(date: Date): string {
  const today = new Date();
  const yearsOld = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    return (yearsOld - 1).toString();
  }

  return yearsOld.toString();
}
