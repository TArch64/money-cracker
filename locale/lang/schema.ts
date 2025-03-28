export type LangRecordTypeSet = {
  income: string;
  expense: string;
};

export interface Lang {
  intro: {
    next: string;
    start: string;
    enable: string;
    skip: string;

    terms: {
      heading: string;
      description: string;

      sections: {
        free: {
          title: string;
          description: string;
        };

        privacy: {
          title: string;
          description: string;
        };

        openSource: {
          title: string;
          description: string;
        };
      };
    };

    enableAuth: {
      heading: string;
      description: string;
    };

    enterPassword: {
      heading: string;
      description: string;
    };
  };

  auth: {
    heading: string;
    unlock: string;
  };

  home: {
    sections: {
      balance: {
        title: string;
      };

      monthStatistics: {
        title: string;
      };

      importPhoto: {
        title: string;
        description: string;

        options: {
          photo: string;
          gallery: string;
        };
      };

      addRecord: {
        add: LangRecordTypeSet;
      };

      goals: {
        title: string;

        empty: {
          description: string;
          new: string;

          copy: {
            copy: string;
            decision: string;
            new: string;
          };
        };
      };

      recentRecords: {
        title: string;
      };

      settings: {
        title: string;
      };
    };
  };

  settings: {
    index: {
      heading: string;

      menu: {
        categories: string;
        importPhoto: string;
        language: string;
        clearData: string;
      };
    };

    importPhoto: {
      heading: string;
      save: string;
      saved: string;

      form: {
        labels: {
          anthropicKey: string;
        };
      };
    };

    language: {
      heading: string;
    };

    clearData: {
      heading: string;
      description: string;
      clear: string;

      confirm: {
        title: string;
        cancel: string;
      };

      confirm1: {
        message: string;
        accept: string;
      };

      confirm2: {
        message: string;
        accept: string;
      };
    };
  };

  records: {
    type: LangRecordTypeSet;

    form: {
      labels: {
        value: LangRecordTypeSet;
        category: string;
        date: string;
      };
    };

    index: {
      title: string;
      empty: string;
    };

    new: {
      title: LangRecordTypeSet;
      add: LangRecordTypeSet;
    };

    edit: {
      title: LangRecordTypeSet;
      save: LangRecordTypeSet;
    };
  };

  categories: {
    form: {
      labels: {
        name: string;
      };

      errors: {
        uniqueName: string;
      };
    };

    index: {
      title: string;
      empty: string;

      delete: {
        entity: string;
      };
    };

    new: {
      title: LangRecordTypeSet;
      add: string;
    };

    edit: {
      title: string;
      save: string;
    };
  };

  budgets: {
    newCategory: string;

    form: {
      labels: {
        spendingGoal: string;
      };
    };

    new: {
      title: string;
      add: string;
    };

    edit: {
      title: string;
      save: string;
    };
  };

  importPhoto: {
    index: {
      heading: string;

      card: {
        status: {
          queued: {
            title: string;
          };

          optimizing: {
            title: string;
          };

          processing: {
            title: string;
          };

          completed: {};

          failed: {
            title: string;

            details: {
              title: string;
            };

            actions: {
              showError: string;
            };
          };

          noData: {
            title: string;
          };
        };

        actions: {
          showSource: string;
        };

        errors: {
          validation: string;
        };
      };
    };
  };

  monthSwitcher: {
    title: string;
  };

  monthStatistics: {
    title: string;
  };

  confirm: {
    delete: {
      title: string;
      message: string;
      accept: string;
    };
  };

  actionsSheet: {
    edit: string;
    rename: string;
    delete: string;
    cancel: string;
  };

  form: {
    labels: {
      password: string;
    };

    errors: {
      required: string;
      minLength: string;
      maxLength: string;
      minValue: string;
      positive: string;
    };
  };

  date: {
    today: string;
    yesterday: string;
  };
}
