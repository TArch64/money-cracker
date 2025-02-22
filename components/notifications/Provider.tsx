import { createContext, type PropsWithChildren, type ReactNode, useContext, useMemo, useRef } from 'react';

interface IContextState {
  isInitialized: boolean;
  isAllowed: boolean;
  androidChannelId: string | null;
}

export type NotificationsInit = Partial<Omit<IContextState, 'isInitialized'>>;

interface INotificationsContext {
  readonly isInitialized: boolean;

  initialize(data?: NotificationsInit): void;
}

const Context = createContext<INotificationsContext>(null!);

export const useNotifications = (): INotificationsContext => useContext(Context);

export function NotificationsProvider(props: PropsWithChildren): ReactNode {
  const state = useRef<IContextState>(null!);

  const context = useMemo((): INotificationsContext => ({
    get isInitialized() {
      return state.current?.isInitialized ?? false;
    },

    initialize(init = {}) {
      state.current = {
        isInitialized: true,
        isAllowed: false,
        androidChannelId: null,
        ...init,
      };
    },
  }), []);

  return (
    <Context.Provider value={context}>
      {props.children}
    </Context.Provider>
  );
}
