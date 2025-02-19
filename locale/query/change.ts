import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase, users } from '@/db';
import { AppLocale } from '@/enums';
import { LOCALE_QUERY } from './locale';

export function useLocaleChangeMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(locale: AppLocale) {
      await db.update(users).set({ locale });
      return locale;
    },

    onSuccess(locale: AppLocale) {
      queryClient.setQueryData(LOCALE_QUERY, locale);
    },
  });
}
