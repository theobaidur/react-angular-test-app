import React from 'react';

import { KFormCard, KSelect, KText, KDatePicker } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import useCardValidation from '../../../utils/useCardValidation';

class CardProfilePersonal {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 4;
      if (!legalData.firstName) result.invalid++;
      if (!legalData.lastName) result.invalid++;
      if (!legalData.birthDate) result.invalid++;
      if (legalData.gender === undefined || legalData.gender.length < 1) result.invalid++;
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardProfilePersonal;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t } = props;

  useCardValidation(props);

  return (
    <>
      {legalData ? (
        <KFormCard
          id={props.id}
          cardName={cardName}
          cardNumber={props.cardNumber}
          state={props.isCardValid}
          disabled={props.disabled}
          handleApprove={props.handleApprove}
          toggleHelp={props.toggleHelp}
          position={props.position}
          closedText={
            `${legalData.firstName} ${legalData.lastName}, 
      ${legalData.birthDate}, ` + (legalData.gender && t(`${cardName}.genderItems.${legalData.gender[0] - 1}`))
          }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1 / 2} force={true}>
                <KText
                  name={'firstName'}
                  label={t(`${cardName}.firstName`)}
                  fieldValue={legalData.firstName}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
              <KFormCol width={1 / 2} force={true}>
                <KText
                  name={'lastName'}
                  label={t(`${cardName}.lastName`)}
                  fieldValue={legalData.lastName}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1 / 2} force={true}>
                <KDatePicker
                  name={'birthDate'}
                  label={t(`${cardName}.birthDate`)}
                  fieldValue={legalData.birthDate}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
              <KFormCol width={1 / 2} force={true}>
                <KSelect
                  name={'gender'}
                  label={t(`${cardName}.gender`)}
                  itemsName={[0, 1, 2].map((e) => {
                    return t(`${cardName}.genderItems.${e}`);
                  })}
                  itemsValue={[1, 2, 3]}
                  fieldValue={legalData.gender}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
          </KFormSection>
        </KFormCard>
      ) : (
        ''
      )}
    </>
  );
};
