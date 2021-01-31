import React, { useState, useEffect } from 'react';
import { KeyboardTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { KFormElement, KDateTimePickerWrapper, KFormError, ClockIcon } from '../KForm_styles';
import AppConstants from '../../../constants/appConstants';
import SimpleValidator from '../../../utils/validator';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

interface KTimePicker_Props {
  name: string;
  label?: string;
  validator?: SimpleValidator;
  validations?: string | Array<string>;
  format?: string;
  fieldValue?: string;
  fieldLayout?: string;
  setFieldValue?: (name: string, value: string) => void;
}
const KTimePicker: React.FC<KTimePicker_Props> = ({
  name,
  label,
  format,
  fieldValue,
  validator,
  validations,
  fieldLayout,
  setFieldValue,
  ...props
}) => {
  const { t } = useTranslation('kForms');
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  useEffect(() => {
    if (validator && validator.messagesShown === true) setCanValidate(true);
  }, [validator]);
  const onBlur = () => {
    setFocused(false);
    if (validator) {
      validator.showMessageFor(label || name);
      setCanValidate(true);
    }
  };
  let emptyLabel: string = (format ? format : '')
    .replace(new RegExp('H', 'g'), t('timePicker.H'))
    .replace(new RegExp('m', 'g'), t('timePicker.M'))
    .replace(new RegExp('S', 'g'), t('timePicker.S'));
  let views: Array<'hours' | 'minutes' | 'seconds'> = [];
  if (format) {
    if (format.indexOf('HH') > -1) {
      views.push('hours');
    }
    if (format.indexOf('mm') > -1) {
      views.push('minutes');
    }
    if (format.indexOf('SS') > -1) {
      views.push('seconds');
    }
  }
  if (canValidate && validator) validator.message(label || name, name, fieldValue || '', validations || '');
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KFormElement invalid={canValidate && validator && !validator.fieldValid(name || label || '')}>
        <KDateTimePickerWrapper>
          <KeyboardTimePicker
            {...props}
            autoOk
            ampm={false}
            variant="inline"
            minutesStep={5}
            invalidDateMessage={t('timePicker.invalidDate')}
            keyboardIcon={<ClockIcon />}
            emptyLabel={focused ? emptyLabel : ''}
            initialFocusedDate={moment().startOf('hour')}
            format={format}
            views={views}
            inputVariant="outlined"
            label={label}
            value={fieldValue && moment(fieldValue, format).isValid() ? moment(fieldValue, format) : null}
            InputAdornmentProps={{ position: 'end' }}
            onChange={(date: any) =>
              date && setFieldValue && date.isValid() && setFieldValue(name, date.format(format))
            }
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={onBlur}
            //need update project to new version of ts
            innerRef={(e: any) => {}}
            className={''}
            ref={null}
            rows={1}
            rowsMax={1}
            style={{} as any}
            color={undefined}
            size={'medium'}
          />
        </KDateTimePickerWrapper>
        {validator && (
          <KFormError>{validator.message(label || name, name, fieldValue || '', validations || '')}</KFormError>
        )}
      </KFormElement>
    </MuiPickersUtilsProvider>
  );
};

KTimePicker.defaultProps = {
  format: AppConstants.TIME_FORMAT
};
export default KTimePicker;
