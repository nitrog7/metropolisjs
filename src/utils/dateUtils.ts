import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import {DateTime} from 'luxon';

export const parseDateTime = (value: string | DateTime | number) => {
  if(isString(value)) {
    return DateTime.fromISO(value).toMillis();
  } else if(isObject(value)) {
    return (value as DateTime).toMillis();
  }

  return value;
};
