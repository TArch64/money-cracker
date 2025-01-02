import { RecordType } from '@/enums';

export const CATEGORIES_LIST_QUERY = (type: RecordType) => ['categories', type, 'list'] as const;
