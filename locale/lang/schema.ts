export type LangRecordTypeSet = {
  income: string;
  expense: string;
}

export interface Lang {
  intro: {
    heading: string;
    description: string;
    start: string;

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

  home: {
    sections: {
      balance: {
        title: string;
      };

      monthStatistics: {
        title: string;
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
          }
        }
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
        clearData: string;
      };
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
      value: LangRecordTypeSet;
      category: string;
      date: string;
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

  confirm: {
    delete: {
      title: string;
      message: string;
      accept: string;
    };
  };

  actionsSheet: {
    edit: string;
    delete: string;
    cancel: string;
  };

  form: {
    errors: {
      required: string;
    };
  };

  date: {
    today: string;
    yesterday: string;
  };
}
