import React, { ReactElement } from 'react';
import { KFormElement } from '../KForm_styles';
import { KFormButton } from './kbutton_styles';

interface KButton_Props {
  look: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  onClick?: any;
}

const KButton: React.FC<KButton_Props> = ({ label, look, ...props }) => {
  const cont = look === 'text' ? label : KButtonIcons[look];

  return (
    <KFormElement className={'buttonHolder'}>
      <KFormButton className={look + 'Button ' + (props.disabled ? 'disabledButton' : '')} {...props}>
        {cont}
      </KFormButton>
      {look === 'add' ? <label>{label}</label> : ''}
    </KFormElement>
  );
};
export default KButton;

interface KButtonIcons_Props {
  [key: string]: ReactElement;
}

const KButtonIcons: KButtonIcons_Props = {
  add: <>&#xE956;</>,
  remove: <>&#xE94E;</>,
  delete: <>&#xE94D;</>
};
