import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import SimpleValidator from '../../../utils/validator';
import { KFormSelectWrapper } from '../../KForm/KSelect/kselect_styles';
import { KFormElement, KFormError } from '../../KForm/KForm_styles';
import { InputActionMeta } from 'react-select/lib/types';

interface KAutosuggestTextProps {
  name: string;
  isDisabled?: boolean;
  fieldLayout?: string;
  validator?: SimpleValidator;
  validations?: string | Array<string>;
  setFieldValue?: Function;
  items: Array<any>;
  label: string;
  fieldValue?: string;
  minListWidth?: string;
}

const NoOptionsMessage: React.FC<any> = (props: any) => {
  return <components.NoOptionsMessage {...props} />;
};

export const KAutosuggestText: React.FC<KAutosuggestTextProps> = (props: KAutosuggestTextProps) => {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>();

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
    inputChangedHandler(`${value}`, { action: 'set-value' });
  };

  const inputChangedHandler = (input: string, reason: InputActionMeta) => {
    if (reason.action === 'input-blur' || reason.action === 'menu-close') {
      props.setFieldValue && props.setFieldValue(props.name, props.fieldValue);
    } else {
      props.setFieldValue && props.setFieldValue(props.name, input);
    }
    setSelectedValue(null);
  };

  if (canValidate && props.validator)
    props.validator.message(props.label || props.name, props.name, props.fieldValue || '', props.validations || '');

  return (
    <KFormElement
      layout={props.fieldLayout}
      invalid={canValidate && props.validator && !props.validator.fieldValid(props.name || props.label || '')}
    >
      <KFormSelectWrapper width={props.minListWidth}>
        {((props.fieldValue && props.fieldValue.length > 0) || '') && (
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
          value={selectedValue}
          defaultValue={selectedValue}
          options={props.items.map((item: string) => {
            return {
              label: `${item}`,
              value: `${item}`
            };
          })}
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

export default KAutosuggestText;
