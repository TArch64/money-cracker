import type { Lang } from './schema';

export const ua: Lang = {
  intro: {
    heading: 'Привіт!',
    description: 'Візьми фінанси у свої руки',
    start: 'Почати',
    sections: {
      free: {
        title: '100% Безкоштовно',
        description: 'Без реклами та преміума',
      },
      privacy: {
        title: 'Приватність',
        description: 'Всі дані зберігаються на пристрої',
      },
      openSource: {
        title: 'Відкритий Код',
        description: 'Шукай допомогу або допомагай на',
      },
    },
  },
  settings: {
    index: {
      heading: 'Налаштування',
      menu: {
        categories: 'Категорії',
        clearData: 'Очистити Дані',
      },
    },
  },
};
