import React from 'react';
import { PrimaryRoundIconButton, UnvisibleContainer, GeneralText } from '../../common/styled';

interface KButton_Props {
  selected: any;
  name: string;
  disabled?: boolean;
  setFieldValue: (name: string, value: any) => void;
  buttons: Array<any>;
}

const KRoundButton: React.FC<KButton_Props> = ({ selected, setFieldValue, disabled, buttons, name }) => {
  let selectedButton: any = buttons.find((item) => item.key === selected);
  return (
    <>
      <PrimaryRoundIconButton
        className={disabled ? 'disabled' : ''}
        type="button"
        content={selected && selectedButton ? selectedButton.content : 'rightBig'}
        size="big"
      >
        <i />
      </PrimaryRoundIconButton>
      <UnvisibleContainer>
        {buttons && buttons.length > 0
          ? buttons.map((button: any, index: number) => (
              <PrimaryRoundIconButton
                key={index}
                size="small"
                type="button"
                content={button.content}
                className={selected && selected.content === button.content ? 'active' : ''}
                onClick={() => setFieldValue(name, button.key)}
              >
                <span className="label">{button.label}</span>
                <i />
              </PrimaryRoundIconButton>
            ))
          : ''}
      </UnvisibleContainer>
      {selectedButton && <GeneralText>{selectedButton.text}</GeneralText>}
    </>
  );
};
export default KRoundButton;
