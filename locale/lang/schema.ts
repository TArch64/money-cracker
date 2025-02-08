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
  settings: {
    index: {
      heading: string;

      menu: {
        categories: string;
        clearData: string;
      };
    };
  };
}
