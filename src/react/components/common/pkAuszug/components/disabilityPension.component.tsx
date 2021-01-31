import React from 'react';
import { GroupProps, DisibilityPensionArrayItem, GroupItemProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel, IconButtonWithText, CounterLabel } from '../../../../components/common/styled';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KSwitch, KNumber, KCheck } from '../../../KForm';
import { Icon } from '../../styled';

export const DisabilityPension: React.FC<GroupProps> = ({
  setFieldValue,
  value,
  t,
  cardName,
  removeFromList,
  addItemToList,
  onClick,
  validator
}) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.disabilityPensionBorderLabel`)}</BorderLabel>
      {value.disability &&
        value.disability.map((item: DisibilityPensionArrayItem, index: number) => (
          <DisabilityPensionItem
            key={index}
            t={t}
            cardName={cardName}
            item={item}
            onClick={onClick}
            index={index}
            setFieldValue={setFieldValue}
            removeFromList={removeFromList}
            validator={validator}
          />
        ))}
      <KFormRow>
        <KFormCol>
          <IconButtonWithText type="button" onClick={() => addItemToList && addItemToList('disability')}>
            <i />
            {t(`${cardName}.addLine`)}
          </IconButtonWithText>
        </KFormCol>
      </KFormRow>
      <KFormRow>
        <KFormCol width={1 / 2}>
          <KSwitch
            name="isChildAvailable"
            label={t(`${cardName}.isChildAvailable`)}
            fieldValue={value.isChildAvailable}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
      </KFormRow>
      {value.isChildAvailable && (
        <KFormRow>
          <KFormCol width={1 / 2} force>
            <KNumber
              name="dischild"
              label={t(`${cardName}.dischild`)}
              fieldValue={value.dischild}
              setFieldValue={setFieldValue}
              onClick={(name: string) => onClick && onClick(name, value.vertexes.dischild)}
              decimal={0}
            />
          </KFormCol>
          <KFormCol width={1 / 2}>
            <KCheck
              name="dischildCheck"
              fieldValue={value.dischildCheck}
              itemsValue={[1]}
              itemsName={[t(`${cardName}.dischildCheck`)]}
              setFieldValue={setFieldValue}
            />
          </KFormCol>
        </KFormRow>
      )}
    </Content>
  );
};

const DisabilityPensionItem: React.FC<GroupItemProps> = ({
  t,
  cardName,
  setFieldValue,
  item,
  index,
  removeFromList,
  onClick,
  validator
}) => {
  return (
    <KFormRow>
      <KFormCol width={1 / 12} force alignItems="center">
        <CounterLabel>{index + 1}</CounterLabel>
      </KFormCol>
      <KFormCol width={3 / 12}>
        <KNumber
          name={`disability.${index}.disvalue`}
          label={t(`${cardName}.disValue`)}
          fieldValue={(item as DisibilityPensionArrayItem).disvalue}
          onClick={(name: string) =>
            onClick && onClick(name, ((item as DisibilityPensionArrayItem).vertexes || {}).disvalue)
          }
          setFieldValue={setFieldValue}
          validations="required"
          validator={validator}
          decimal={0}
        />
      </KFormCol>
      <KFormCol width={3 / 12}>
        <KNumber
          name={`disability.${index}.diswait`}
          label={t(`${cardName}.disWait`)}
          onClick={(name: string) =>
            onClick && onClick(name, ((item as DisibilityPensionArrayItem).vertexes || {}).diswait)
          }
          fieldValue={(item as DisibilityPensionArrayItem).diswait}
          setFieldValue={setFieldValue}
          validations="required"
          validator={validator}
          decimal={0}
        />
      </KFormCol>
      <KFormCol width={4 / 12}>
        <KCheck
          name={`disability.${index}.disaccident`}
          fieldValue={(item as DisibilityPensionArrayItem).disaccident}
          itemsValue={[1]}
          itemsName={[t(`${cardName}.disAccident`)]}
          setFieldValue={setFieldValue}
        />
      </KFormCol>
      <KFormCol width={1 / 12} force alignItems="center">
        <Icon
          style={{ padding: 0, margin: 0 }}
          size="32"
          content="close"
          onClick={() => removeFromList && removeFromList('disability', index)}
        />
      </KFormCol>
    </KFormRow>
  );
};
