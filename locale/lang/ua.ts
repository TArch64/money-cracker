import type { Lang } from './schema';

export const ua: Lang = {
  intro: {
    next: 'Далі',
    start: 'Почати',
    enable: 'Увімкнути',
    skip: 'Пропустити',

    terms: {
      heading: 'Привіт!',
      description: 'Візьми фінанси у свої руки',

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

    enableAuth: {
      heading: 'Захисти Свої Дані',
      description: 'Увімкни аутентифікацію для збереження своїх даних',
    },

    enterPassword: {
      heading: 'Захисти Свої Дані',
      description: 'Пароль буде використовуватися як резервний метод',
    },
  },

  auth: {
    heading: 'Уведіть Пароль',
    unlock: 'Розблокувати',
  },

  home: {
    sections: {
      balance: {
        title: 'Баланс',
      },

      importPhoto: {
        title: 'Імпорт з Фото',
        description: 'Додайте покупки з фото чеку',

        options: {
          photo: 'Нове Фото',
          gallery: 'З Галереї',
        },
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
        importPhoto: 'Імпорт з Фото',
        language: 'Мова',
        clearData: 'Очистити Дані',
      },
    },

    importPhoto: {
      heading: 'Імпорт з Фото',
      save: 'Зберегти',
      saved: 'Збережено',

      form: {
        labels: {
          anthropicKey: 'Anthropic API Ключ',
        },
      },
    },

    language: {
      heading: 'Мова',
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
      labels: {
        value: {
          income: 'Зароблено',
          expense: 'Витрачено',
        },

        category: 'Категорія',
        date: 'Дата',
      },
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

  categories: {
    form: {
      labels: {
        name: 'Назва',
      },

      errors: {
        uniqueName: 'Категорія з такою назвою вже існує',
      },
    },

    index: {
      title: 'Категорії',
      empty: 'Поки що немає категорій цього типу',

      delete: {
        entity: 'Категорію',
      },
    },

    new: {
      title: {
        income: 'Нова Категорія Доходу',
        expense: 'Нова Категорія Витрат',
      },

      add: 'Додати',
    },

    edit: {
      title: '{{name}}',
      save: 'Зберегти',
    },
  },

  budgets: {
    newCategory: 'Додати Категорію',

    form: {
      labels: {
        spendingGoal: 'Ціль витрат',
      },
    },

    new: {
      title: 'Нові Цілі Витрат',
      add: 'Додати Цілі',
    },

    edit: {
      title: 'Редагувати Цілі',
      save: 'Зберегти',
    },
  },

  importPhoto: {
    index: {
      heading: 'Імпорт з Фото',

      card: {
        status: {
          queued: {
            title: 'В Черзі',
          },

          optimizing: {
            title: 'Оптимізація',
          },

          processing: {
            title: 'Обробка',
          },

          completed: {},

          failed: {
            title: 'Помилка',

            details: {
              title: 'Деталі Помилки',
            },

            actions: {
              showError: 'Деталі Помилки',
            },
          },
        },

        actions: {
          showSource: 'Показати Фото',
        },
      },
    },
  },

  monthSwitcher: {
    title: 'Активний Місяць',
  },

  monthStatistics: {
    title: 'Статистика',
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
    rename: 'Переназвати',
    delete: 'Видалити',
    cancel: 'Відмінити',
  },

  form: {
    labels: {
      password: 'Пароль',
    },

    errors: {
      required: 'Це поле обовʼязкове',
      minLength: 'Мінімальна довжина {{length}} символів',
      maxLength: 'Максимальна довжина {{length}} символів',
      minValue: 'Мінімальне значення {{value}}',
      positive: 'Повинно бути додатнім числом',
    },
  },

  date: {
    today: 'Сьогодні',
    yesterday: 'Вчора',
  },
};
