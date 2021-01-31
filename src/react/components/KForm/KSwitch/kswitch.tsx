import React, { useState, useEffect } from 'react';
import { KFormSwitch, KFormSwitchHidden } from './kswitch_styles';
import { KFormElement, KFormError } from '../KForm_styles';
import SimpleValidator from '../../../utils/validator';

interface KSwitch_Props {
  label: string;
  name?: string;
  fieldValue?: boolean;

  validator?: SimpleValidator;
  validations?: string | Array<string>;
  setFieldValue?: any;
}
const KSwitch: React.FC<KSwitch_Props> = ({
  label,
  name,
  fieldValue,
  validator,
  validations,
  setFieldValue,
  ...props
}) => {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  useEffect(() => {
    if (validator && validator.messagesShown === true) setCanValidate(true);
  }, [validator]);
  if (canValidate && validator) validator.message(label, name || label, fieldValue || '', validations || '');
  return (
    <KFormElement
      className={'switchHolder'}
      invalid={canValidate && validator && !validator.fieldValid(name || label || '')}
    >
      <KFormSwitch
        className={fieldValue ? 'checked' : ''}
        onClick={() => {
          setFieldValue(name, !fieldValue);
          setCanValidate(true);
        }}
        {...props}
      >
        <KFormSwitchHidden
          type={'checkbox'}
          value={fieldValue ? 1 : 0}
          name={name}
          checked={fieldValue ? true : false}
          readOnly
        />
      </KFormSwitch>
      <label>{label}</label>
      {validator && (
        <KFormError>{validator.message(label, name || label, fieldValue || '', validations || '')}</KFormError>
      )}
    </KFormElement>
  );
};
export default KSwitch;
