import { createContext, type PropsWithChildren, type ReactNode, useContext, useMemo, useRef } from 'react';

interface IContextState {
  isInitialized: boolean;
  isAllowed: boolean;
  androidChannelId?: string;
}

export type NotificationsInit = Partial<Omit<IContextState, 'isInitialized'>>;

interface INotificationsContext {
  readonly isInitialized: boolean;
  readonly androidChannelId?: string;
  initialize: (data?: NotificationsInit) => void;
}

const Context = createContext<INotificationsContext>(null!);

export const useNotifications = (): INotificationsContext => useContext(Context);

export function NotificationsProvider(props: PropsWithChildren): ReactNode {
  const state = useRef<IContextState>(null!);

  const context = useMemo((): INotificationsContext => ({
    get isInitialized() {
      return state.current?.isInitialized ?? false;
    },

    get androidChannelId() {
      return state.current?.androidChannelId;
    },

    initialize(init = {}) {
      state.current = {
        isInitialized: true,
        isAllowed: false,
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
