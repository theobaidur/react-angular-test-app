import React, { useState, useEffect, useRef } from 'react';
import { KFormElement, KFormLabel, KFormError } from '../KForm_styles';
import { KFormText } from './ktext_styles';
import SimpleValidator from '../../../utils/validator';
import MaskedInput from 'react-text-mask';

interface KText_Props {
  name: string;
  autoFocus?: boolean;
  label: string;
  fieldValue?: string;
  fieldLayout?: string;
  placeholder?: string;
  validator?: SimpleValidator;
  noFloatLabel?: boolean;
  expectAutofill?: boolean;
  validations?: string | Array<string>;
  textColor?: string;
  type?: string;
  mask?: any;
  setFieldValue?: (name: string, value: string) => void;
  onClick?: (name: string) => void;
}

const KText: React.FC<KText_Props> = ({
  name,
  label,
  fieldValue,
  fieldLayout,
  onClick,
  placeholder,
  noFloatLabel,
  expectAutofill,
  validator,
  validations,
  autoFocus,
  setFieldValue,
  textColor,
  type,
  mask,
  ...props
}) => {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const input: any = useRef<HTMLInputElement>();
  useEffect(() => {
    if (autoFocus) input.current.focus();
  }, [autoFocus]);
  useEffect(() => {
    if (validator && validator.messagesShown === true) setCanValidate(true);
  }, [validator]);
  const onBlur = () => {
    if (validator) {
      validator.showMessageFor(label);
      setCanValidate(true);
    }
  };
  if (canValidate && validator) validator.message(label, name, fieldValue || '', validations || '');

  return (
    <KFormElement invalid={canValidate && validator && !validator.fieldValid(name || label || '')} layout={fieldLayout}>
      {mask ? (
        <MaskedInput
          mask={mask ? mask : (rawValue) => false}
          onChange={(e: any) => setFieldValue && setFieldValue(name, e.target.value)}
          onBlur={onBlur}
          onClick={() => onClick && onClick(name)}
          placeholderChar={'\u2000'}
          render={(ref: any, props: any) => (
            <KFormText
              type={type ? type : 'text'}
              name={name}
              className={(noFloatLabel ? 'no-float-label' : '') + (expectAutofill ? ' autofillFix' : '')}
              value={fieldValue || ''}
              placeholder={placeholder}
              textColor={textColor}
              ref={(input) => ref(input)}
              {...props}
            />
          )}
        />
      ) : (
        <KFormText
          type={type ? type : 'text'}
          ref={input}
          name={name}
          className={(noFloatLabel ? 'no-float-label' : '') + (expectAutofill ? ' autofillFix' : '')}
          value={fieldValue || ''}
          onChange={(e: any) => setFieldValue && setFieldValue(name, e.target.value)}
          onBlur={onBlur}
          onClick={() => onClick && onClick(name)}
          {...props}
          placeholder={placeholder}
          textColor={textColor}
        />
      )}
      <KFormLabel>{label}</KFormLabel>
      {validator && <KFormError>{validator.message(label, name, fieldValue || '', validations || '')}</KFormError>}
    </KFormElement>
  );
};
export default KText;
