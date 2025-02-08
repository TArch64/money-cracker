import type { Lang } from './schema';

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
};
