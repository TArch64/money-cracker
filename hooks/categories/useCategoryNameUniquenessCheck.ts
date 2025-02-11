import { useMemo } from 'react';
import { checkAsync } from 'valibot';
import { useTranslation } from 'react-i18next';
import { categories, useDatabase } from '@/db';
import { and, eq, not } from 'drizzle-orm';

export interface ICategoryNameUniquenessCheckProps {
  excludeId?: number;
}

export function useCategoryNameUniquenessCheck(props: ICategoryNameUniquenessCheckProps = {}) {
  const { t } = useTranslation();
  const db = useDatabase();

  return useMemo(() => {
    return checkAsync<string, string>(async (name) => {
      let where = eq(categories.name, name);

      if (props.excludeId) {
        where = and(where, not(eq(categories.id, props.excludeId)))!;
      }

      const rows = await db
        .select()
        .from(categories)
        .where(where);

      return !rows.length;
    }, t('categories.form.errors.uniqueName'));
  }, []);
}
