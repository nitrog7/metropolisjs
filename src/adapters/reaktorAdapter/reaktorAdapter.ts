import {parseId, parseNum, parseString, parseUrl, parseVarChar} from '@nlabs/utils';

export class ReaktorValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ReaktorValidationError';
  }
}

export const validateReaktorContent = (content?: string, length: number = 500): string | undefined => {
  try {
    return parseReaktorContent(content, length);
  } catch(error) {
    throw new ReaktorValidationError(`Content validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'content');
  }
};

export const validateReaktorDate = (date?: number): number | undefined => {
  try {
    return parseReaktorDate(date);
  } catch(error) {
    throw new ReaktorValidationError(`Date validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'date');
  }
};

export const validateReaktorItemId = (itemId?: string): string | undefined => {
  try {
    return parseReaktorItemId(itemId);
  } catch(error) {
    throw new ReaktorValidationError(`Item ID validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'itemId');
  }
};

export const validateReaktorName = (name?: string): string | undefined => {
  try {
    return parseReaktorName(name);
  } catch(error) {
    throw new ReaktorValidationError(`Name validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'name');
  }
};

export const validateReaktorType = (type?: string): string | undefined => {
  try {
    return parseReaktorType(type);
  } catch(error) {
    throw new ReaktorValidationError(`Type validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'type');
  }
};

export const validateReaktorUrl = (url?: string): string | undefined => {
  try {
    return parseReaktorUrl(url);
  } catch(error) {
    throw new ReaktorValidationError(`URL validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'url');
  }
};

export const parseReaktorContent = (content?: string, length: number = 500): string | undefined =>
  (content ? parseString(content, length) : undefined);

export const parseReaktorDate = (date?: number): number | undefined =>
  (date ? parseNum(date, 13) : undefined);

export const parseReaktorItemId = (itemId?: string): string | undefined =>
  (itemId ? parseId(itemId) : undefined);

export const parseReaktorName = (name?: string): string | undefined =>
  (name ? parseString(name, 160) : undefined);

export const parseReaktorType = (type?: string): string | undefined =>
  (type ? parseVarChar(type, 160) : undefined);

export const parseReaktorUrl = (url?: string): string | undefined =>
  (url ? parseUrl(url) : undefined);