type RecordTypeSet = {
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
        add: RecordTypeSet;
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
    type: RecordTypeSet;

    form: {
      value: RecordTypeSet;
      category: string;
      date: string;
    };

    new: {
      title: RecordTypeSet;
      add: RecordTypeSet;
    };

    edit: {
      title: RecordTypeSet;
      save: RecordTypeSet;
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
    title: string;
    edit: string;
    delete: string;
    cancel: string;
  };

  form: {
    errors: {
      required: string;
    };
  };
}
