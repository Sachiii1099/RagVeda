import { Language, TranslationDict } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { mr } from './locales/mr';
import { ta } from './locales/ta';
import { te } from './locales/te';
import { gu } from './locales/gu';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { bn } from './locales/bn';

export type { Language, TranslationDict };

export const translations: Record<Language, TranslationDict> = {
  en,
  hi,
  mr,
  ta,
  te,
  gu,
  kn,
  ml,
  bn,
};
