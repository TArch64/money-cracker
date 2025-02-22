import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { date, object } from 'valibot';
import { set as setDate } from 'date-fns';
import { AppReminderState } from '@/enums';
import { useUserSuspenseQuery, useUserUpdateMutation } from '@/hooks/queries';
import { Form, type FormEventHandler, FormTimepicker } from '@/components/form';
import { useDebounce } from '@/hooks/useDebounce';

interface IReminderStateProps {
  state: AppReminderState;
  active: AppReminderState;
  onActivate: (state: AppReminderState) => void;
}

function ReminderState(props: IReminderStateProps): ReactNode {
  const { t } = useTranslation();

  return (
    <Radio
      style={styles.state}
      checked={props.state === props.active}
      onChange={() => props.onActivate(props.state)}
    >
      {(txtProps) => (
        <View>
          <Text
            {...txtProps}
            style={[txtProps?.style, styles.stateTitle]}
          >
            {t(`settings.notifications.reminder.states.${props.state}`)}
          </Text>
        </View>
      )}
    </Radio>
  );
}

const timeSchema = object({
  time: date(),
});

type TimeSchema = typeof timeSchema;

export function ReminderSettings(): ReactNode {
  const { t } = useTranslation();
  const userQuery = useUserSuspenseQuery();
  const updateMutation = useUserUpdateMutation();

  function activate(state: AppReminderState): void {
    updateMutation.mutate({ reminder: state });
  }

  const initialTime = useMemo(() => {
    return setDate(new Date(), {
      hours: userQuery.data.reminderHour,
      minutes: userQuery.data.reminderMinute,
    });
  }, [userQuery.data.reminderHour, userQuery.data.reminderMinute]);

  const onTimeChange = useDebounce<FormEventHandler<TimeSchema>>((event) => {
    updateMutation.mutate({
      reminderHour: event.value.time.getHours(),
      reminderMinute: event.value.time.getMinutes(),
    });
  }, 100, []);

  return (
    <View>
      <Text style={styles.heading}>
        {t('settings.notifications.reminder.heading')}
      </Text>

      <View style={styles.stateList}>
        <ReminderState
          state={AppReminderState.EVERYDAY}
          active={userQuery.data.reminder}
          onActivate={activate}
        />

        <ReminderState
          state={AppReminderState.IF_NO_RECORDS}
          active={userQuery.data.reminder}
          onActivate={activate}
        />

        <ReminderState
          state={AppReminderState.OFF}
          active={userQuery.data.reminder}
          onActivate={activate}
        />
      </View>

      {userQuery.data.reminder !== AppReminderState.OFF && (
        <Form
          schema={timeSchema}
          initialValues={{ time: initialTime }}
          onChange={onTimeChange}
        >
          {({ f }) => (
            <FormTimepicker
              label={t('settings.notifications.reminder.form.labels.time')}
              placeholder={t('settings.notifications.reminder.form.labels.time')}
              name={f('time')}
            />
          )}
        </Form>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 8,
    marginBottom: 16,
    fontWeight: 500,
  } satisfies TextStyle,

  stateList: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 12,
  } satisfies ViewStyle,

  state: {
    paddingVertical: 6,
    paddingLeft: 6,
  } satisfies ViewStyle,

  stateTitle: {
    fontWeight: 400,
    marginTop: -2,
  } satisfies TextStyle,
});
