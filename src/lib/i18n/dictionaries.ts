import { en } from './en';
import { es } from './es';

export type Lang = 'en' | 'es';
const maps = { en, es } as const;

export async function getDictionary(lang: Lang) {
  return maps[lang] ?? maps.en;
}
