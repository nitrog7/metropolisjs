import {DateTime} from 'luxon';

export const parseDateTime = (value: string | number | DateTime) => {
  if(typeof value === 'string') {
    return DateTime.fromISO(value).toMillis();
  } else if(value instanceof DateTime) {
    return (value as DateTime).toMillis();
  }

  return value;
};
