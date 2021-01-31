import React, { useState, useEffect } from 'react';
import { KFormElement, KFormLabel, KFormError, PercentageSymbol } from '../KForm_styles';
import { KFormNumber } from './knumber_styles';
import SimpleValidator from '../../../utils/validator';
import AppConstants from '../../../constants/appConstants';
import { useMemoizedCallback } from '../../../utils/customCallbackHook';

interface KNumber_Props {
  name: string;
  label: string;
  fieldValue?: number;
  fieldLayout?: string;
  decimal?: number;
  needVerify?: string;
  validator?: SimpleValidator;
  validations?: string | Array<string>;
  noFloatLabel?: boolean;
  isPercent?: boolean;
  placeHolder?: string;
  showNum?: boolean;
  readonly?: boolean;
  setFieldValue?: (name: string, value: any) => void;
  onClick?: (name: string) => void;
}

const KNumber: React.FC<KNumber_Props> = ({
  name,
  label,
  fieldValue,
  fieldLayout,
  placeHolder,
  decimal,
  isPercent,
  needVerify,
  noFloatLabel,
  showNum = true,
  onClick,
  validator,
  validations,
  setFieldValue,
  readonly,
  ...props
}) => {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [needVerifyText, setNeedVerifyText] = useState<string>('');
  const [inputValue, setValue] = useState<string>(
    fieldValue || fieldValue === 0
      ? showNum
        ? String(fieldValue).replace(AppConstants.NUMBER_REPLACE_REGEX, AppConstants.NUMBER_REPLACE_CHARACTER)
        : String(fieldValue)
      : ''
  );

  const setFieldValueInternal = useMemoizedCallback(() => {
    if (Number(showNum ? inputValue.replace(/`/g, '') : inputValue) !== fieldValue && inputValue !== '-') {
      let newValue: string =
        fieldValue || fieldValue === 0
          ? showNum
            ? String(fieldValue).replace(AppConstants.NUMBER_REPLACE_REGEX, AppConstants.NUMBER_REPLACE_CHARACTER)
            : String(fieldValue)
          : '';
      if (newValue.lastIndexOf('.') >= 0) {
        newValue = newValue.substring(newValue.lastIndexOf('.'), decimal && decimal > 0 ? decimal : 0);
      }

      setValue(newValue);
      if (setFieldValue)
        setFieldValue(name, fieldValue === undefined || isNaN(fieldValue) ? undefined : Number(fieldValue));
    }
  }, [fieldValue, inputValue, name, setFieldValue, showNum]);

  useEffect(() => {
    setFieldValueInternal();
  }, [fieldValue, setFieldValueInternal]);

  useEffect(() => {
    setNeedVerifyText(needVerify || '');
  }, [needVerify]);
  useEffect(() => {
    if (validator && validator.messagesShown === true) {
      setCanValidate(true);
    }
  }, [validator]);

  const handleKeyDown = (e: any) => {
    if (e.which === 38 || e.which === 40) {
      e.preventDefault();
    }
  };
  const handleBlur = (e: any) => {
    if (validator) {
      validator.showMessageFor(label);
      setCanValidate(true);
    }
    if (needVerifyText) setNeedVerifyText('');
  };
  const handleFocus = (e: any) => {};
  const onChange: (e: any) => void = (evt: any) => {
    const value: string = String(evt.target.value.replace(/`/g, '') || evt.target.value);
    if (
      String(value).match(`^-?[0-9]{0,12}${decimal && decimal > 0 ? `\\.?[0-9]{0,${decimal}}` : '\\.?[0-9]{0,2}'}$`)
    ) {
      let newValue: string = value.replace(/\B(?=(\d{3})+(?!\d))/g, '`');
      if (newValue.lastIndexOf('.') >= 0) {
        if( !decimal ){ 
          newValue = newValue.substring(newValue.lastIndexOf('.'), decimal && decimal > 0 ? decimal : 0);
        }
      }
      setValue(
        (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') ||
          (newValue.length > 2 && newValue[0] === '-' && newValue[1] === '0' && newValue[2] !== '.')
          ? newValue.substr(1)
          : newValue
      );
      if (setFieldValue) setFieldValue(name, value !== '' ? Number(value) : undefined);
    }
  };

  if (canValidate && validator)
    validator.message(label || name, name, fieldValue === 0 ? 0 : fieldValue || '', validations || '');

  return (
    <KFormElement layout={fieldLayout} invalid={canValidate && validator && !validator.fieldValid(name || label || '')}>
      {inputValue && inputValue !== '-' && isPercent ? (
        <PercentageSymbol left={inputValue.length * 8 + 20 + 'px'}>%</PercentageSymbol>
      ) : (
        ''
      )}
      <KFormNumber
        type="text"
        name={name}
        className={noFloatLabel ? 'no-float-label' : ''}
        value={inputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={() => onClick && onClick(name)}
        onChange={onChange}
        {...props}
        placeholder={placeHolder}
        readOnly={readonly}
      />

      <KFormLabel>{label}</KFormLabel>
      {needVerifyText && <KFormError style={{ color: 'orange' }}>{needVerifyText}</KFormError>}
      {validator && (
        <KFormError>
          {validator.message(label || name, name, fieldValue === 0 ? 0 : fieldValue || '', validations || '')}
        </KFormError>
      )}
    </KFormElement>
  );
};

export default KNumber;
