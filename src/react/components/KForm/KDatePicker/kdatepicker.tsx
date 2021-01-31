import React, { useState, useEffect } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { KFormElement, KDateTimePickerWrapper, KFormError, CalendarIcon } from '../KForm_styles';
import AppConstants from '../../../constants/appConstants';
import SimpleValidator from '../../../utils/validator';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'moment/locale/de';

moment.locale('de');

interface KDatePicker_Props {
  name: string;
  label?: string;
  format?: string;
  fieldValue?: string;
  validator?: SimpleValidator;
  noFloatLabel?: boolean;
  validations?: string;
  fieldLayout?: string;
  setFieldValue?: (name: string, value: string) => void;
  onClick?: (name: string) => void;
}
const KDatePicker: React.FC<KDatePicker_Props> = ({
  name,
  label,
  format,
  fieldValue,
  validator,
  validations,
  onClick,
  fieldLayout,
  noFloatLabel,
  setFieldValue,
  ...props
}) => {
  const { t } = useTranslation('kForms');
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [validationRules, setValidations] = useState<string | undefined>('required');
  const [focused, setFocused] = useState<boolean>(false);
  const onBlur = () => {
    setFocused(false);
    if (validator) {
      validator.showMessageFor(label || name);
      setCanValidate(true);
    }
  };
  useEffect(() => {
    if ((validator && validator.messagesShown === true) || (validator && fieldValue)) {
      setCanValidate(true);
    }
  }, [validator, fieldValue]);

  useEffect(() => {
    let temp: string = validations ? `valid_date:${format}|${validations}` : `valid_date:${format}`;
    if (temp.indexOf('before') === -1)
      temp += `|before:${moment()
        .add(100, 'years')
        .format(format)},${format}`;
    if (temp.indexOf('after') === -1)
      temp += `|after:${moment()
        .add(-100, 'years')
        .format(format)},${format}`;
    if (temp) setValidations(temp);
  }, [validations, format]);

  let emptyLabel: string = (format ? format : '')
    .replace(new RegExp('D', 'g'), t('datePicker.D'))
    .replace(new RegExp('M', 'g'), t('datePicker.M'))
    .replace(new RegExp('Y', 'g'), t('datePicker.Y'));
  let views: Array<'month' | 'year' | 'date'> = [];
  if (format) {
    if (format.indexOf('DD') > -1) {
      views.push('date');
    }
    if (format.indexOf('MM') > -1) {
      views.push('month');
    }
    if (format.indexOf('YYYY') > -1) {
      views.push('year');
    }
  }
  if (canValidate && validator) {
    validator.message(label || name, name, fieldValue || '', validationRules || '');
    validator.showMessageFor(label || name);
  }
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KFormElement invalid={canValidate && validator && !validator.fieldValid(name)}>
        <KDateTimePickerWrapper>
          <KeyboardDatePicker
            innerRef={(e: any) => {}}
            className={''}
            rows={1}
            ref={null}
            rowsMax={1}
            style={{} as any}
            autoOk
            variant="inline"
            format={format}
            emptyLabel={focused ? emptyLabel : ''}
            inputVariant="outlined"
            label={noFloatLabel ? '' : label}
            views={views}
            keyboardIcon={<CalendarIcon />}
            value={fieldValue ? moment(fieldValue, format) : null}
            InputAdornmentProps={{ position: 'end' }}
            onChange={(date: any) => {
              if (date && setFieldValue) setFieldValue(name, date.format(format));
              else if (!date && setFieldValue) setFieldValue(name, '');
            }}
            onBlur={onBlur}
            onFocus={() => {
              if (onClick) onClick(name);
              setFocused(true);
            }}
            onOpen={() => onClick && onClick(name)}
            color={undefined}
            size={'medium'}
          />
        </KDateTimePickerWrapper>
        {validator && (
          <KFormError>{validator.message(label || name, name, fieldValue || '', validationRules || '')}</KFormError>
        )}
      </KFormElement>
    </MuiPickersUtilsProvider>
  );
};

KDatePicker.defaultProps = {
  format: AppConstants.DATE_FORMAT
};
export default KDatePicker;
