import React from 'react';
import { GroupProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel } from '../../../../components/common/styled';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KDatePicker, KText } from '../../../KForm';

export const PersonalData: React.FC<GroupProps> = ({ setFieldValue, t, cardName, value, onClick, validator }) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.dateNameBorderLabel`)}</BorderLabel>
      <KFormRow>
        <KFormCol width={1 / 3}>
          <KDatePicker
            name={'date'}
            label={t(`${cardName}.date`)}
            fieldValue={value.date}
            setFieldValue={setFieldValue}
            onClick={(name: string) => onClick && onClick(name, (value.vertexes || {}).date)}
            validations="required"
            validator={validator}
          />
        </KFormCol>
        <KFormCol width={2 / 3}>
          <KText
            name="company"
            label={t(`${cardName}.companyName`)}
            fieldValue={value.company}
            setFieldValue={setFieldValue}
            onClick={(name: string) => onClick && onClick(name, (value.vertexes || {}).company)}
            validations="required"
            validator={validator}
          />
        </KFormCol>
      </KFormRow>
    </Content>
  );
};
