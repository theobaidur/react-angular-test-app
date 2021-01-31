import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { KFormSelectWrapper } from './kselect_styles';
import { KFormElement, KFormError } from '../KForm_styles';
import SimpleValidator from '../../../utils/validator';

interface SelectProps {
  name: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  fieldLayout?: string;
  isSearchable?: boolean;
  validator?: SimpleValidator;
  validations?: string | Array<string>;
  setFieldValue?: Function;
  itemsName: Array<string>;
  itemsValue: Array<number>;
  label: string;
  inverse?: boolean;
  fieldValue?: Array<number>;
}

const NoOptionsMessage: React.FC<any> = (props: any) => {
  return <components.NoOptionsMessage {...props} />;
};

export const KSelect: React.FC<SelectProps> = (props: SelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  const onBlur = () => {
    setFocused(false);
    if (props.validator) {
      setCanValidate(true);
      props.validator.showMessageFor(props.label);
    }
  };

  const onFocus = () => setFocused(true);

  useEffect(() => {
    if (props.validator && props.validator.messagesShown === true) {
      setCanValidate(true);
    }
  }, [props.validator]);
  const valueChangedHandler = (evt: any) => {
    let value: string = evt && evt.value ? evt.value : '';
    if (props.setFieldValue != null) props.setFieldValue(props.name, [value]);
  };

  const valuesChangedHandler = (evts: any) => {
    let value: Array<string> = evts && evts.length > 0 ? evts.map((item: any) => item.value) : [];
    if (props.setFieldValue != null) props.setFieldValue(props.name, value);
  };

  const onInputChange = (evt: string) => {
    setInputValue(evt);
  };

  let options: Array<any> = [];
  props.itemsName.forEach((item, index) =>
    options.push({
      label: item,
      value: props.itemsValue[index]
    })
  );

  let selectedValues: Array<any> = options.filter((item) => props.fieldValue && props.fieldValue.includes(item.value));
  if (canValidate && props.validator)
    props.validator.message(props.label || props.name, props.name, props.fieldValue || '', props.validations || '');
  return (
    <KFormElement
      layout={props.fieldLayout}
      invalid={canValidate && props.validator && !props.validator.fieldValid(props.name || props.label || '')}
    >
      <KFormSelectWrapper>
        {((selectedValues && selectedValues.length > 0) || inputValue) && (
          <span className={(props.isDisabled ? 'title disabled' : 'title') + (focused ? ' focused' : '')}>
            {props.label}
          </span>
        )}
        <Select
          placeholder={props.label}
          onInputChange={onInputChange}
          components={{
            NoOptionsMessage
          }}
          isClearable={props.isClearable}
          isDisabled={props.isDisabled}
          isSearchable={props.isSearchable}
          isMulti={props.isMulti}
          className={`react-select-container ${props.inverse ? 'inverse' : ''}`}
          classNamePrefix="react-select"
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={props.isMulti ? valuesChangedHandler : valueChangedHandler}
          value={selectedValues}
          options={options}
          theme={(theme: any) => ({
            ...theme,
            borderRadius: '0'
          })}
        />
      </KFormSelectWrapper>
      {props.validator && (
        <KFormError>
          {props.validator.message(props.label, props.name, props.fieldValue || '', props.validations || '')}
        </KFormError>
      )}
    </KFormElement>
  );
};

export default KSelect;
