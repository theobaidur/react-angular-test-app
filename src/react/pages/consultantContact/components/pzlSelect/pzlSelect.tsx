import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import SimpleValidator from '../../../../utils/validator';
import { KFormSelectWrapper } from '../../../../components/KForm/KSelect/kselect_styles';
import { KFormElement, KFormError } from '../../../../components/KForm/KForm_styles';
import { InputActionMeta } from 'react-select/lib/types';

interface PzlSelectItem {
  label: string;
  value: string;
}

interface PzlSelectProps {
  name: string;
  isDisabled?: boolean;
  fieldLayout?: string;
  validator?: SimpleValidator;
  validations?: string | Array<string>;
  setFieldValue?: Function;
  onInputChange?: Function;
  items: Array<any>;
  label: string;
  fieldValue?: string;
  minListWidth?: string;
}

const NoOptionsMessage: React.FC<any> = (props: any) => {
  return <components.NoOptionsMessage {...props} />;
};

export const PlzSelect: React.FC<PzlSelectProps> = (props: PzlSelectProps) => {
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
    console.log('valueChangedHandler ' + JSON.stringify(evt));
    let value: string = evt && evt.value ? evt.value : '';
    inputChangedHandler(`${value}`, { action: 'set-value' });
    props.setFieldValue && props.setFieldValue(props.name, evt ? evt : `${value}`);
    props.onInputChange && props.onInputChange(`${value}`);
  };

  const inputChangedHandler = (input: string, reason: InputActionMeta) => {
    console.log('inputChangedHandler ' + input + ' ' + reason.action);
    if (reason.action === 'input-blur' || reason.action === 'menu-close') {
      props.setFieldValue && props.setFieldValue(props.name, props.fieldValue);
      return;
    } else {
      props.setFieldValue && props.setFieldValue(props.name, input);
      props.onInputChange && props.onInputChange(input);
    }
  };

  let selectedValues: Array<any> = props.items.filter(
    (item) => props.fieldValue && props.fieldValue.includes(item.value)
  );

  if (canValidate && props.validator)
    props.validator.message(props.label || props.name, props.name, props.fieldValue || '', props.validations || '');

  return (
    <KFormElement
      layout={props.fieldLayout}
      invalid={canValidate && props.validator && !props.validator.fieldValid(props.name || props.label || '')}
    >
      <KFormSelectWrapper width={props.minListWidth}>
        {((selectedValues && selectedValues.length > 0) || '') && (
          <span className={(props.isDisabled ? 'title disabled' : 'title') + (focused ? ' focused' : '')}>
            {props.label}
          </span>
        )}
        <Select
          placeholder={props.label}
          onInputChange={(t, r) => {
            inputChangedHandler(t, r);
          }}
          components={{
            NoOptionsMessage,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null
          }}
          inputValue={props.fieldValue}
          isClearable={true}
          isDisabled={props.isDisabled}
          isSearchable={true}
          isMulti={false}
          className="react-select-container"
          classNamePrefix="react-select"
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={valueChangedHandler}
          value={selectedValues}
          options={props.items}
          theme={(theme: any) => ({
            ...theme,
            borderRadius: '0'
          })}
        />
      </KFormSelectWrapper>
      {canValidate && props.validator && (
        <KFormError>
          {props.validator.message(props.label, props.name, props.fieldValue || '', props.validations || '')}
        </KFormError>
      )}
    </KFormElement>
  );
};

export default PlzSelect;
