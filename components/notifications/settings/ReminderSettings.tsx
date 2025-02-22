import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { date, object } from 'valibot';
import { set as setDate } from 'date-fns';
import { AppReminderState } from '@/enums';
import { useUserSuspenseQuery, useUserUpdateMutation } from '@/hooks/queries';
import { Form, FormTimepicker } from '@/components/form';

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

      <Form
        schema={timeSchema}
        initialValues={{ time: initialTime }}
        onChange={(event) => {
          console.log(event.value.time);
        }}
      >
        {({ f }) => (
          <FormTimepicker
            label={t('settings.notifications.reminder.form.labels.time')}
            placeholder={t('settings.notifications.reminder.form.labels.time')}
            name={f('time')}
          />
        )}
      </Form>
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
