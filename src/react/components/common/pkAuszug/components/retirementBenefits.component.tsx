import React from 'react';
import { GroupProps, RetirementBenefitItem, GroupItemProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel, IconButtonWithText, CounterLabel } from '../../../../components/common/styled';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KNumber } from '../../../KForm';
import { Icon } from '../../styled';

export const RetirementBenefits: React.FC<GroupProps> = ({
  setFieldValue,
  value,
  cardName,
  t,
  removeFromList,
  onClick,
  addItemToList,
  ...props
}) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.retirementBenefitsBorderLabel`)}</BorderLabel>
      {value.retirement &&
        value.retirement.length > 0 &&
        value.retirement.map((item: RetirementBenefitItem, index: number) => (
          <RetirementBenefitsRow
            item={item}
            key={index}
            cardName={cardName}
            t={t}
            setFieldValue={setFieldValue}
            onClick={onClick}
            index={index}
            removeFromList={removeFromList}
          />
        ))}
      <KFormRow>
        <KFormCol>
          <IconButtonWithText type="button" onClick={() => addItemToList && addItemToList('retirement')}>
            <i />
            {t(`${cardName}.addLine`)}
          </IconButtonWithText>
        </KFormCol>
      </KFormRow>
    </Content>
  );
};

const RetirementBenefitsRow: React.FC<GroupItemProps> = ({
  t,
  cardName,
  removeFromList,
  setFieldValue,
  index,
  item,
  onClick
}) => {
  return (
    <KFormRow key={index}>
      <KFormCol width={1 / 12} force alignItems="center" style={{ width: '3%', minWidth: '3%' }}>
        <CounterLabel>{index + 1}</CounterLabel>
      </KFormCol>
      <KFormCol width={1 / 6} style={{ width: '120px', minWidth: '5%' }}>
        <KNumber
          name={`retirement.${index}.pensionage`}
          label={t(`${cardName}.pensionAge`)}
          fieldValue={(item as RetirementBenefitItem).pensionage}
          onClick={(name: string) =>
            onClick && onClick(name, ((item as RetirementBenefitItem).vertexes || {}).pensionage)
          }
          setFieldValue={setFieldValue}
          decimal={0}
        />
      </KFormCol>
      <KFormCol width={1 / 3}>
        <KNumber
          name={`retirement.${index}.pensioncapital`}
          label={t(`${cardName}.pensionCapital`)}
          fieldValue={(item as RetirementBenefitItem).pensioncapital}
          onClick={(name: string) =>
            onClick && onClick(name, ((item as RetirementBenefitItem).vertexes || {}).pensioncapital)
          }
          setFieldValue={setFieldValue}
          decimal={0}
        />
      </KFormCol>
      <KFormCol width={1 / 3}>
        <KNumber
          name={`retirement.${index}.pensionyear`}
          label={t(`${cardName}.pensionYear`)}
          fieldValue={(item as RetirementBenefitItem).pensionyear}
          onClick={(name: string) =>
            onClick && onClick(name, ((item as RetirementBenefitItem).vertexes || {}).pensionyear)
          }
          setFieldValue={setFieldValue}
          decimal={0}
        />
      </KFormCol>
      <KFormCol width={1 / 12} force alignItems="center" style={{ width: '3%', minWidth: '3%' }}>
        <Icon
          style={{ padding: 0, margin: 0 }}
          size="32"
          content="close"
          onClick={() => removeFromList && removeFromList('retirement', index)}
        />
      </KFormCol>
    </KFormRow>
  );
};
