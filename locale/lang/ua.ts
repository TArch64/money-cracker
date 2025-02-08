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

    clearData: {
      heading: 'Очистити Дані',
      description: 'Ви впевнені що хочете видалити всі дані? Ця дія не може бути відмінена',
      clear: 'Очистити',

      confirm: {
        title: 'Очистка Дані',
        cancel: 'Відмінити',
      },

      confirm1: {
        message: 'Ви впевнені?',
        accept: 'Так, Видалити',
      },

      confirm2: {
        message: 'Ви точно впевнені?',
        accept: 'Так, Точно',
      },
    },
  },
};
