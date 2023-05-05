export function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
export function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export function timeAgo(date: Date): string {
  const timeSpan = Date.now() - date.getTime();
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  if (timeSpan < 60 * seconds) return 'now';
  if (timeSpan < 60 * minutes) {
    const minutesAgo = Math.floor(timeSpan / minutes);
    return minutesAgo > 1 ? `${minutesAgo} minutes ago` : 'a minute ago';
  }
  if (timeSpan < 24 * hours) {
    const hoursAgo = Math.floor(timeSpan / hours);
    return hoursAgo > 1 ? `${hoursAgo} hours ago` : 'an hour ago';
  }
  if (timeSpan < 30 * days) {
    const daysAgo = Math.floor(timeSpan / days);
    return daysAgo > 1 ? `${daysAgo} hours ago` : 'a day ago';
  }
  if (timeSpan < 365 * days) {
    const monthsAgo = Math.floor(timeSpan / (days * 30));
    return monthsAgo > 1 ? `${monthsAgo} months ago` : 'a month ago';
  }
  const yearsAgo = Math.floor(timeSpan / (days * 365));
  return yearsAgo > 1 ? `${yearsAgo} years ago` : 'a year ago';
}
