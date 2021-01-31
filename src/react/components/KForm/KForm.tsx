import React from 'react';
import KText from './KText';
import KDatePicker from './KDatePicker';
import KTimePicker from './KTimePicker';
import KNumber from './KNumber';
import KSelect from './KSelect';
import KCheck from './KCheck';
import KRadio from './KRadio';
import KSwitch from './KSwitch';

interface KFormCreateElement_Props {
  label: string;
  name: string;
  inputType: string;

  fieldLayout?: string;

  placeHolder?: string;
  format?: string;
  decimal?: number;
  itemsName?: string[];
  itemsValue?: number[];
  min?: number;
  max?: number;
  multiple?: boolean;

  initialValue?: string | number;
}

const KFormCreateElement: React.FC<KFormCreateElement_Props> = ({ label, inputType, ...props }) => {
  if (inputType === 'number') {
    return <KNumber label={label} {...props} />;
  } else if (inputType === 'text') {
    return <KText label={label} {...props} />;
  } else if (inputType === 'select') {
    if (props.itemsName && props.itemsValue) {
      return <KSelect label={label} itemsName={props.itemsName} itemsValue={props.itemsValue} {...props} />;
    }
  } else if (inputType === 'check') {
    if (props.itemsName && props.itemsValue) {
      return <KCheck label={label} itemsName={props.itemsName} itemsValue={props.itemsValue} {...props} />;
    }
  } else if (inputType === 'radio') {
    if (props.itemsName && props.itemsValue) {
      return <KRadio label={label} itemsName={props.itemsName} itemsValue={props.itemsValue} {...props} />;
    }
  } else if (inputType === 'date') {
    let format = props.format ? props.format : '';
    return <KDatePicker label={label} format={format} {...props} />;
  } else if (inputType === 'time') {
    let format = props.format ? props.format : '';
    return <KTimePicker label={label} format={format} {...props} />;
  } else if (inputType === 'switch') {
    return <KSwitch label={label} {...props} />;
  }
  return <></>;
};
export default KFormCreateElement;
