import type { Lang, LangRecordTypeSet } from './schema';

const recordTypeTitleSet: LangRecordTypeSet = {
  income: 'Income',
  expense: 'Expense',
};

export const en: Lang = {
  intro: {
    heading: 'Welcome!',
    description: 'Take control of your finances today',
    start: 'Start',

    sections: {
      free: {
        title: '100% Free, Forever',
        description: ' No ads, no premium, no data selling',
      },

      privacy: {
        title: 'Privacy First',
        description: 'All your data stays on your device',
      },

      openSource: {
        title: 'Open Source',
        description: 'Report issues & contribute on',
      },
    },
  },

  home: {
    sections: {
      balance: {
        title: 'Current Balance',
      },

      addRecord: {
        add: {
          income: `Add ${recordTypeTitleSet.income}`,
          expense: `Add ${recordTypeTitleSet.expense}`,
        },
      },

      goals: {
        title: 'Spending Goals',

        empty: {
          description: 'There are no goals for this month yet',
          new: 'Add Goals',

          copy: {
            copy: 'Copy',
            decision: 'from previous month or',
            new: 'Add New Goals',
          },
        },
      },

      recentRecords: {
        title: 'Recent Transactions',
      },

      monthStatistics: {
        title: 'Month Statistics',
      },

      settings: {
        title: 'Settings',
      },
    },
  },

  settings: {
    index: {
      heading: 'Settings',

      menu: {
        categories: 'Categories',
        clearData: 'Clear Data',
      },
    },

    clearData: {
      heading: 'Clear Data',
      description: 'Are you sure you want to delete all your data? This action cannot be undone',
      clear: 'Clear Data',

      confirm: {
        title: 'Clear Data',
        cancel: 'Cancel',
      },

      confirm1: {
        message: 'Are you sure?',
        accept: 'Yes, Delete',
      },

      confirm2: {
        message: 'Are you really sure?',
        accept: 'Yes, I\'m Sure',
      },
    },
  },

  records: {
    type: recordTypeTitleSet,

    form: {
      value: {
        income: 'Money received',
        expense: 'Money spent',
      },

      category: 'Category',
      date: 'Date',
    },

    index: {
      title: 'Records',
      empty: 'No records for this month',
    },

    new: {
      title: {
        income: `New ${recordTypeTitleSet.income}`,
        expense: `New ${recordTypeTitleSet.expense}`,
      },

      add: {
        income: `Add ${recordTypeTitleSet.income}`,
        expense: `Add ${recordTypeTitleSet.expense}`,
      },
    },

    edit: {
      title: {
        income: `Edit ${recordTypeTitleSet.income}`,
        expense: `Edit ${recordTypeTitleSet.expense}`,
      },

      save: {
        income: `Save ${recordTypeTitleSet.income}`,
        expense: `Save ${recordTypeTitleSet.expense}`,
      },
    },
  },

  monthSwitcher: {
    title: 'Select Month',
  },

  confirm: {
    delete: {
      title: 'Delete {{entity}}',
      message: 'Are you sure you want to delete {{entity}}',
      accept: 'Delete',
    },
  },

  actionsSheet: {
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
  },

  form: {
    errors: {
      required: 'This field is required',
    },
  },

  date: {
    today: 'Today',
    yesterday: 'Yesterday',
  },
};
