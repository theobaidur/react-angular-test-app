import React from 'react';

import { KFormCard, KSelect, KDatePicker } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import { useStore } from 'react-redux';
import useCardValidation from '../../../utils/useCardValidation';

class CardProfileConnection {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 2;
      if (!legalData.mode || legalData.mode.length < 1) result.invalid++;
      if (!legalData.modeStart) result.invalid++;
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardProfileConnection;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t } = props;
  const state = useStore().getState();
  const gendered = state.myPerson.gender[0] === state.myPartner.gender[0] ? 2 : 1;

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
          closedText={t(`${cardName}.closedText`, {
            mode: legalData.mode && t(`${cardName}.modeItems${gendered}.${legalData.mode[0] - 1}`),
            start: legalData.modeStart
          })}
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1 / 2} force={true}>
                <KSelect
                  name={'mode'}
                  label={t(`${cardName}.mode`)}
                  itemsName={[0, 1, 2].map((e) => {
                    return t(`${cardName}.modeItems${gendered}.${e}`);
                  })}
                  itemsValue={[1, 2, 3]}
                  fieldValue={legalData.mode}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
              <KFormCol width={1 / 2} force={true}>
                <KDatePicker
                  name={'modeStart'}
                  label={t(`${cardName}.modeStart${legalData.mode}`)}
                  fieldValue={legalData.modeStart}
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
