import {DateTime} from 'luxon';

export interface ColumnSize {
  readonly columns: number;
  readonly size: number;
}

export const getColumnSize = (
  theme: any,
  width: number,
  maxItemWidth: number,
  containerPadding: number = 0
): ColumnSize => {
  const containerWidth: number = width - (8 * containerPadding);
  const columns: number = Math.ceil(containerWidth / maxItemWidth);
  const size: number = (containerWidth - (8 * (columns - 1) * 2)) / columns;

  return {columns, size};
};

export const isExpired = (expires: number, limitInMin: number): boolean =>
  DateTime.local().diff(DateTime.fromMillis(expires), ['minutes']).minutes > limitInMin;
