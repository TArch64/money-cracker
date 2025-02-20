import type { i18n } from 'i18next';
import { maxLength, minLength, minValue, setSpecificMessage } from 'valibot';

export function updateValibotLocale(t: i18n['t']): void {
  setSpecificMessage(minLength, (issue) => issue.requirement === 1
    ? t('form.errors.required')
    : t('form.errors.minLength', { length: issue.requirement }),
  );

  setSpecificMessage(maxLength, (issue) => t('form.errors.maxLength', { length: issue.requirement }));

  setSpecificMessage(minValue, (issue) => {
    switch (issue.requirement) {
      case 0:
        return t('form.errors.positive');
      case 1:
        return t('form.errors.required');
      default:
        return t('form.errors.minValue', { value: issue.requirement });
    }
  });
}
