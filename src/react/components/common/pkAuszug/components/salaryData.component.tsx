import React from 'react';
import { GroupProps } from '../pkAuszug.interfaces';
import { Content, BorderLabel } from '../../../../components/common/styled';
import { KFormRow, KFormCol } from '../../../KForm/KForm_styles';
import { KNumber } from '../../../KForm';

export const SalaryData: React.FC<GroupProps> = ({ t, cardName, setFieldValue, value, onClick, validator }) => {
  return (
    <Content>
      <BorderLabel>{t(`${cardName}.salaryDataBorderLabel`)}</BorderLabel>
      <KFormRow>
        <KFormCol width={1 / 3}>
          <KNumber
            name="incomeyear"
            label={t(`${cardName}.incomeYear`)}
            onClick={(name: string) => onClick && onClick(name, value.vertexes.incomeyear)}
            fieldValue={value.incomeyear}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
            decimal={0}
          />
        </KFormCol>
        <KFormCol width={1 / 3}>
          <KNumber
            name="incomeinsured"
            onClick={(name: string) => onClick && onClick(name, value.vertexes.incomeinsured)}
            label={t(`${cardName}.incomeInsured`)}
            fieldValue={value.incomeinsured}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
            decimal={0}
          />
        </KFormCol>
        <KFormCol width={1 / 3}>
          <KNumber
            onClick={(name: string) => onClick && onClick(name, value.vertexes.workload)}
            name="workload"
            label={t(`${cardName}.workload`)}
            fieldValue={value.workload}
            setFieldValue={setFieldValue}
            validations="required"
            validator={validator}
            decimal={0}
          />
        </KFormCol>
      </KFormRow>
    </Content>
  );
};
