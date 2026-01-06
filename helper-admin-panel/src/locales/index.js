import uzLatin from './uz-latin';
import uzCyrillic from './uz-cyrillic';
import ru from './ru';

export const translations = {
  'uz-latin': uzLatin,
  'uz-cyrillic': uzCyrillic,
  'ru': ru,
};

export const defaultLanguage = 'uz-latin';

export const availableLanguages = [
  { id: 'uz-latin', name: 'O\'zbek (Lotin)', flag: '🇺🇿' },
  { id: 'uz-cyrillic', name: 'O\'zbek (Kirill)', flag: '🇺🇿' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
];
