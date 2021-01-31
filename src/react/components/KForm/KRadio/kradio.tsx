import React, { useState, useEffect } from 'react';
import { KFormElement, KFormError } from '../KForm_styles';
import { KFormSquareWrapper, KFormSquareItem, KFormSquareBox, KFormLabel } from '../KForm_styles';
import SimpleValidator from '../../../utils/validator';

interface KRadio_Props {
  name: string;
  label?: string;
  className?: string;
  itemsName: string[];
  itemsValue: number[];
  validator?: SimpleValidator;
  validations?: string | Array<string>;
  fieldValue?: number[];
  fieldLayout?: string;
  noLabel?: boolean;
  setFieldValue?: (name: string, value: number[]) => void;
  // Formik setValue
  setValue?: (value: any) => void;
}

const KRadio: React.FC<KRadio_Props> = ({
  name,
  label,
  className,
  itemsName,
  itemsValue,
  fieldLayout,
  validator,
  validations,
  fieldValue,
  noLabel,
  setValue,
  setFieldValue
}) => {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  useEffect(() => {
    if (validator && validator.messagesShown === true) {
      setCanValidate(true);
    }
  }, [validator]);
  const handleClick = (e: any, index: number) => {
    if (validator) {
      validator.showMessageFor(label || name);
      setCanValidate(true);
    }
    let target: HTMLDivElement = e.target as HTMLDivElement;
    const targetValue: string | null = target.getAttribute('data-value');
    const val = parseFloat(targetValue || '');
    if (val === null || val === undefined) {
      return;
    }
    let newValue = fieldValue ? [...fieldValue] : [];

    newValue = [val];
    setValue && setValue(newValue);
    if (setFieldValue) {
      setFieldValue(name, newValue);
    }
  };
  if (canValidate && validator) validator.message(label || name, name, fieldValue || '', validations || '');
  return (
    <KFormElement
      layout={fieldLayout}
      invalid={canValidate && validator && !validator.fieldValid(name || label || '')}
      className={className}
      noLabel={noLabel}
      staticLabel
    >
      <KFormSquareWrapper className={'radio'}>
        {itemsValue.map((Elem: number, index: number) => {
          const checked = fieldValue && fieldValue.indexOf(Elem) > -1 ? true : false;
          return (
            <KFormSquareItem data-value={Elem} key={index} onClick={(evt) => handleClick(evt, index)}>
              {itemsName[index]}
              <KFormSquareBox className={(checked ? 'checked' : '') + ' rounded'} />
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

export default KRadio;
