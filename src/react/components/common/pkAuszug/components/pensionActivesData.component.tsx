import React from 'react';
import { GroupProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel } from '../../../../components/common/styled';
import { KFormCol, KFormRow } from '../../../KForm/KForm_styles';
import { KNumber } from '../../../KForm';

export const PensionActivesData: React.FC<GroupProps> = ({ t, cardName, setFieldValue, value, onClick, validator }) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.pensionActivesDataBorderLabel`)}</BorderLabel>
      <KFormRow>
        <KFormCol width={1 / 3}>
          <KNumber
            name="credittotal"
            onClick={(name: string) => onClick && onClick(name, value.vertexes.credittotal)}
            label={t(`${cardName}.creditTotal`)}
            fieldValue={value.credittotal}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
            decimal={0}
          />
        </KFormCol>
        <KFormCol width={1 / 3}>
          <KNumber
            label={t(`${cardName}.creditBvg`)}
            onClick={(name: string) => onClick && onClick(name, value.vertexes.creditbvg)}
            name={'creditbvg'}
            fieldValue={value.creditbvg}
            setFieldValue={setFieldValue}
            decimal={0}
          />
        </KFormCol>
        <KFormCol width={1 / 3}>
          <KNumber
            label={t(`${cardName}.maxPayIn`)}
            onClick={(name: string) => onClick && onClick(name, value.vertexes.maxpayin)}
            name={'maxpayin'}
            fieldValue={value.maxpayin}
            decimal={0}
            setFieldValue={setFieldValue}
          />
        </KFormCol>
      </KFormRow>
    </Content>
  );
};
