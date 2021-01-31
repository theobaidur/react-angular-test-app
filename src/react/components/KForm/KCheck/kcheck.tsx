import React, { useState, useEffect } from 'react';
import { KFormElement, KFormError } from '../KForm_styles';
import { KFormSquareWrapper, KFormSquareItem, KFormSquareBox, KFormLabel } from '../KForm_styles';
import SimpleValidator from '../../../utils/validator';

interface KCheck_Props {
  name: string;
  label?: string;
  className?: string;
  multiple?: boolean;
  itemsName: string[] | any[];
  itemsValue: number[];
  fieldValue?: number[];

  validator?: SimpleValidator;
  validations?: string | Array<string>;
  fieldLayout?: string;
  noLabel?: boolean;
  darkMode?: boolean;
  disabled?: boolean;
  setFieldValue?: (name: string, value: number[]) => void;
  // Formik setValue
  setValue?: (value: any) => void;
}

const KCheck: React.FC<KCheck_Props> = ({
  name,
  label,
  className,
  itemsName,
  itemsValue,
  fieldLayout,
  fieldValue,
  validator,
  validations,
  multiple,
  noLabel,
  setValue,
  setFieldValue,
  darkMode,
  disabled
}) => {
  const isMultiple = multiple || false;
  const [canValidate, setCanValidate] = useState<boolean>(false);

  useEffect(() => {
    if (validator && validator.messagesShown === true) {
      setCanValidate(true);
    }
  }, [setCanValidate, validator]);

  const handleClick = (e: any, index: number) => {
    if (validator) {
      validator.showMessageFor(label || name);
    }
    let target: HTMLDivElement = e.target as HTMLDivElement;
    const val = parseFloat(target.getAttribute('data-value') || '');
    if (!val) {
      return;
    }
    let newValue = fieldValue ? [...fieldValue] : [];
    if (isMultiple) {
      if (newValue.indexOf(val) > -1) {
        newValue = newValue.filter((x) => x !== val);
      } else {
        newValue.push(val);
      }
    } else {
      newValue = fieldValue && fieldValue.length > 0 ? [] : [val];
    }
    setValue && setValue(newValue);
    if (setFieldValue) {
      setFieldValue(name, newValue);
    }
    setCanValidate(true);
  };

  if (canValidate && validator) validator.message(label || name, name, fieldValue || '', validations || '');

  return (
    <KFormElement
      invalid={canValidate && validator && !validator.fieldValid(name || label || '')}
      layout={fieldLayout}
      className={className}
      noLabel={noLabel}
      style={{ width: 'auto' }}
      staticLabel
      disabled={disabled}
    >
      <KFormSquareWrapper className={(isMultiple ? 'multiple' : 'single') + ' check'}>
        {itemsValue.map((Elem: number, index: number) => {
          const checked = fieldValue && fieldValue.indexOf(Elem) > -1 ? true : false;
          return (
            <KFormSquareItem
              key={index}
              onClick={(evt) => (disabled ? () => {} : handleClick(evt, index))}
              data-value={Elem}
            >
              {itemsName[index]}
              <KFormSquareBox className={checked ? 'checked' : ''} darkMode={darkMode} disabled={disabled} />
            </KFormSquareItem>
          );
        })}
      </KFormSquareWrapper>
      {noLabel ? '' : <KFormLabel fontSize="12">{label}</KFormLabel>}
      {validator && (
        <KFormError>{validator.message(label || name, name, fieldValue || '', validations || '')}</KFormError>
      )}
    </KFormElement>
  );
};

export default KCheck;
