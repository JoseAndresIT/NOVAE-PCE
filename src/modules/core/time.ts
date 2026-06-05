export type TimeSnapshot = {
  clock: string;
  date: string;
  greeting: string;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const padTime = (value: number) => value.toString().padStart(2, '0');

export const getGreeting = (date: Date, name = 'Jose') => {
  const hour = date.getHours();

  if (hour < 12) {
    return `Good morning, ${name}`;
  }

  if (hour < 18) {
    return `Good afternoon, ${name}`;
  }

  return `Good evening, ${name}`;
};

export const getTimeSnapshot = (date = new Date()): TimeSnapshot => ({
  clock: `${padTime(date.getHours())}:${padTime(date.getMinutes())}`,
  date: dateFormatter.format(date),
  greeting: getGreeting(date),
});
