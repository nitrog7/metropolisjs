/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {z} from 'zod';

export interface TranslationType {
  readonly key: string;
  readonly locale: string;
  readonly value: string;
  readonly namespace?: string;
  readonly timestamp?: number;
}

export interface TranslationInputType {
  readonly key: string;
  readonly locale: string;
  readonly value: string;
  readonly namespace?: string;
}

export class TranslationValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'TranslationValidationError';
  }
}

const translationSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  locale: z.string().min(2, 'Locale is required').max(5, 'Locale must be less than 5 characters'),
  value: z.string().min(1, 'Value is required'),
  namespace: z.string().optional(),
  timestamp: z.number().optional()
});

const translationInputSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  locale: z.string().min(2, 'Locale is required').max(5, 'Locale must be less than 5 characters'),
  value: z.string().min(1, 'Value is required'),
  namespace: z.string().optional()
});

export const parseTranslation = (translation: TranslationType): TranslationType => {
  try {
    const validated = translationSchema.parse(translation);
    return validated as TranslationType;
  } catch(error) {
    if(error instanceof z.ZodError) {
      const field = error.issues[0]?.path.join('.');
      const message = error.issues[0]?.message || 'Validation failed';
      throw new TranslationValidationError(message, field);
    }
    throw error;
  }
};

export const parseTranslationInput = (translation: TranslationInputType): TranslationInputType => {
  try {
    const validated = translationInputSchema.parse(translation);
    return validated as TranslationInputType;
  } catch(error) {
    if(error instanceof z.ZodError) {
      const field = error.issues[0]?.path.join('.');
      const message = error.issues[0]?.message || 'Validation failed';
      throw new TranslationValidationError(message, field);
    }
    throw error;
  }
};

export const validateTranslationInput = (input: unknown): TranslationInputType => {
  return parseTranslationInput(input as TranslationInputType);
};