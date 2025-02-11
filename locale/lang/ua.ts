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

  home: {
    sections: {
      balance: {
        title: 'Баланс',
      },

      addRecord: {
        add: {
          income: 'Новий Дохід',
          expense: 'Нові Витрати',
        },
      },

      goals: {
        title: 'Цілі Витрат',

        empty: {
          description: 'Поки що не додано жодної цілі на цей місяць',
          new: 'Додати Цілі',

          copy: {
            copy: 'Скопіювати',
            decision: 'з минулого місяця або',
            new: 'Додани Нові',
          },
        },
      },

      recentRecords: {
        title: 'Останні Операції',
      },

      monthStatistics: {
        title: 'Статистика Місяця',
      },

      settings: {
        title: 'Налаштування',
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

  records: {
    type: {
      income: 'Дохід',
      expense: 'Витрати',
    },

    form: {
      value: {
        income: 'Зароблено',
        expense: 'Витрачено',
      },

      category: 'Категорія',
      date: 'Дата',
    },

    index: {
      title: 'Операції',
      empty: 'Немає операцій за цей місяць',
    },

    new: {
      title: {
        income: 'Новий Дохід',
        expense: 'Нові Витрати',
      },

      add: {
        income: 'Додати',
        expense: 'Додати',
      },
    },

    edit: {
      title: {
        income: 'Редагувати Дохід',
        expense: 'Редагувати Витрати',
      },

      save: {
        income: 'Зберегти',
        expense: 'Зберегти',
      },
    },
  },

  monthSwitcher: {
    title: 'Активний Місяць',
  },

  confirm: {
    delete: {
      title: 'Видалити {{entity}}',
      message: 'Ви впевнені що хочете видалити {{entity}}',
      accept: 'Видалити',
    },
  },

  actionsSheet: {
    edit: 'Редагувати',
    delete: 'Видалити',
    cancel: 'Відмінити',
  },

  form: {
    errors: {
      required: 'Це поле обовʼязкове',
    },
  },

  date: {
    today: 'Сьогодні',
    yesterday: 'Вчора',
  },
};
