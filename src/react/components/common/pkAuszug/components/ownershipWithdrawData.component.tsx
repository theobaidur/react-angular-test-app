import React, { useState, useEffect } from 'react';
import { GroupProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel, IconButtonWithText, Icon } from '../../../../components/common/styled';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KNumber } from '../../../KForm';

export const OwnershipWithdrawData: React.FC<GroupProps> = ({
  t,
  cardName,
  setFieldValue,
  setFieldValues,
  value,
  onClick,
  validator
}) => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (isOpen === undefined && (value.gotwef !== undefined || value.maxwef !== undefined))
      setIsOpen(!isNaN(value.gotwef) || !isNaN(value.maxwef));
  }, [value.gotwef, value.maxwef, isOpen]);

  return (
    <Content>
      <BorderLabel>{t(`${cardName}.ownershipWithdrawDataBorderLabel`)}</BorderLabel>
      {isOpen ? (
        <KFormRow>
          <KFormCol width={6 / 12}>
            <KNumber
              label={t(`${cardName}.gotWef`)}
              name={'gotwef'}
              onClick={(name: string) => onClick && onClick(name, value.vertexes.gotwef)}
              fieldValue={value.gotwef}
              decimal={0}
              setFieldValue={setFieldValue}
              validator={validator}
              validations={`required_or_zero|min:0,num`}
            />
          </KFormCol>
          <KFormCol width={5 / 12}>
            <KNumber
              name={'maxwef'}
              label={t(`${cardName}.maxWef`)}
              onClick={(name: string) => onClick && onClick(name, value.vertexes.maxwef)}
              fieldValue={value.maxwef}
              decimal={0}
              setFieldValue={setFieldValue}
              validator={validator}
              validations={`required_or_zero`}
            />
          </KFormCol>
          <KFormCol width={1 / 12} force alignItems="center">
            <Icon
              style={{ padding: 0, margin: 0 }}
              size="32"
              content="close"
              onClick={() => {
                setFieldValues([
                  {
                    name: 'gotwef',
                    value: 0
                  },
                  {
                    name: 'maxwef',
                    value: 0
                  }
                ]);
                setIsOpen(false);
                if (validator) {
                  validator.purgeFields();
                  validator.messagesShown = true;
                  validator.forceUpdate();
                }
              }}
            />
          </KFormCol>
        </KFormRow>
      ) : (
        <KFormRow>
          <KFormCol>
            <IconButtonWithText
              type="button"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <i />
              {t(`${cardName}.addLine`)}
            </IconButtonWithText>
          </KFormCol>
        </KFormRow>
      )}
    </Content>
  );
};
