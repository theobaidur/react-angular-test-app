import React from 'react';
import { Content, BorderLabel, IconButtonWithText, CounterLabel } from '../../../../components/common/styled';
import { GroupProps, DeathBenefitArrayItem, GroupItemProps } from '../pkAuszug.interfaces';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KNumber, KCheck } from '../../../KForm';
import { Icon } from '../../styled';

export const DeathBenefit: React.FC<GroupProps> = ({
  value,
  setFieldValue,
  removeFromList,
  t,
  cardName,
  addItemToList,
  onClick,
  validator
}) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.deathBenefitBorderLabel`)}</BorderLabel>
      {value.deathBenefit &&
        value.deathBenefit.map((item: DeathBenefitArrayItem, index: number) => (
          <DeathBenefitItem
            key={index}
            item={item}
            setFieldValue={setFieldValue}
            index={index}
            t={t}
            cardName={cardName}
            onClick={onClick}
            removeFromList={removeFromList}
            validator={validator}
          />
        ))}
      <KFormRow>
        <KFormCol>
          <IconButtonWithText type="button" onClick={() => addItemToList && addItemToList('deathBenefit')}>
            <i />
            {t(`${cardName}.addLine`)}
          </IconButtonWithText>
        </KFormCol>
      </KFormRow>
    </Content>
  );
};

export const DeathBenefitItem: React.FC<GroupItemProps> = ({
  item,
  setFieldValue,
  onClick,
  index,
  t,
  cardName,
  removeFromList,
  validator,
  ...props
}) => {
  return (
    <>
      <KFormRow>
        <KFormCol width={1 / 12} force alignItems="center">
          <CounterLabel>{index + 1}</CounterLabel>
        </KFormCol>
        <KFormCol width={10 / 12}>
          <KNumber
            name={`deathBenefit.${index}.deathcapital`}
            label={t(`${cardName}.deathCapital`)}
            fieldValue={(item as DeathBenefitArrayItem).deathcapital}
            onClick={(name: string) =>
              onClick && onClick(name, ((item as DeathBenefitArrayItem).vertexes || {}).deathcapital)
            }
            decimal={0}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
          />
        </KFormCol>

        <KFormCol width={1 / 12} force alignItems="center">
          <Icon
            style={{ padding: 0, margin: 0 }}
            size="32"
            content="close"
            onClick={() => removeFromList && removeFromList('deathBenefit', index)}
          />
        </KFormCol>
      </KFormRow>
      <KFormRow>
        <KFormCol width={1 / 2}>
          <KCheck
            fieldValue={(item as DeathBenefitArrayItem).deathillness}
            name={`deathBenefit.${index}.deathillness`}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.deathillness`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
        <KFormCol width={1 / 2}>
          <KCheck
            fieldValue={(item as DeathBenefitArrayItem).deathaccident}
            name={`deathBenefit.${index}.deathaccident`}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.deathaccident`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
        <KFormCol width={1 / 2}>
          <KCheck
            fieldValue={(item as DeathBenefitArrayItem).deathmarried}
            name={`deathBenefit.${index}.deathmarried`}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.deathmarried`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
        <KFormCol width={1 / 2}>
          <KCheck
            fieldValue={(item as DeathBenefitArrayItem).deathnotmarried}
            name={`deathBenefit.${index}.deathnotmarried`}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.deathnotmarried`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
      </KFormRow>
    </>
  );
};
