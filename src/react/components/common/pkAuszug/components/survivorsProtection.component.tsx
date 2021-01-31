import React from 'react';
import { GroupProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel } from '../../../../components/common/styled';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KNumber, KCheck } from '../../../KForm';

export const SurvivorsProtection: React.FC<GroupProps> = ({
  cardName,
  t,
  value,
  setFieldValue,
  onClick,
  validator
}) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.survivorsProtectionBorderLabel`)}</BorderLabel>
      <KFormRow>
        <KFormCol width={1 / 4}>
          <KNumber
            name="widowvalue"
            label={t(`${cardName}.widowValue`)}
            onClick={(name: string) => onClick && onClick(name, value.vertexes.widowvalue)}
            fieldValue={value.widowvalue}
            decimal={0}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
          />
        </KFormCol>
        <KFormCol width={1 / 4}>
          <KCheck
            name="widowaccident"
            fieldValue={value.widowaccident}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.widowAccident`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
        <KFormCol width={1 / 4}>
          <KNumber
            name="orphanvalue"
            label={t(`${cardName}.orphanValue`)}
            onClick={(name: string) => onClick && onClick(name, value.vertexes.orphanvalue)}
            fieldValue={value.orphanvalue}
            decimal={0}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
          />
        </KFormCol>
        <KFormCol width={1 / 4}>
          <KCheck
            name="orphanaccident"
            fieldValue={value.orphanaccident}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.orphanAccident`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
        <KFormCol width={1 / 4}>
          <KCheck
            name="lifePartner"
            fieldValue={value.lifePartner}
            itemsValue={[1]}
            itemsName={[t(`${cardName}.lifePartner`)]}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
      </KFormRow>
    </Content>
  );
};
