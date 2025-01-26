import { RecordType } from '@/enums';

export const CATEGORIES_LIST_QUERY = (type: RecordType) => ['categories', type, 'list'] as const;
export const CATEGORIES_LIST_WITH_USAGE_QUERY = (type: RecordType) => [...CATEGORIES_LIST_QUERY(type), 'usage'] as const;
