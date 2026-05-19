export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 0) return "0 min";

  const minutesInHour = 60;
  const minutesInDay = 24 * minutesInHour;
  const minutesInWeek = 7 * minutesInDay;
  const minutesInMonth = 30 * minutesInDay; // Approximation
  const minutesInYear = 365 * minutesInDay; // Approximation

  if (totalMinutes < 1) {
    return "< 1 min";
  }

  if (totalMinutes < minutesInHour) {
    return `${totalMinutes} min`;
  }

  if (totalMinutes < minutesInDay) {
    const hours = Math.floor(totalMinutes / minutesInHour);
    const mins = totalMinutes % minutesInHour;
    return mins > 0 ? `${hours} h ${mins} min` : `${hours} h`;
  }

  if (totalMinutes < minutesInWeek) {
    const days = Math.floor(totalMinutes / minutesInDay);
    const hours = Math.floor((totalMinutes % minutesInDay) / minutesInHour);
    return hours > 0 ? `${days} j ${hours} h` : `${days} j`;
  }

  if (totalMinutes < minutesInMonth) {
    const weeks = Math.floor(totalMinutes / minutesInWeek);
    const days = Math.floor((totalMinutes % minutesInWeek) / minutesInDay);
    return days > 0 ? `${weeks} sem ${days} j` : `${weeks} sem`;
  }

  if (totalMinutes < minutesInYear) {
    const months = Math.floor(totalMinutes / minutesInMonth);
    const weeks = Math.floor((totalMinutes % minutesInMonth) / minutesInWeek);
    return weeks > 0 ? `${months} mois ${weeks} sem` : `${months} mois`;
  }

  const years = Math.floor(totalMinutes / minutesInYear);
  const months = Math.floor((totalMinutes % minutesInYear) / minutesInMonth);
  return months > 0 ? `${years} an(s) ${months} mois` : `${years} an(s)`;
}