import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { KFormCard, KRadio } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import { changeMyPartnerState } from '../../../redux/actions';
import { CardQuestion } from '../../../components/common/styled';
import useCardValidation from '../../../utils/useCardValidation';

class CardProfilePartner {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 1;
      if (!legalData.hasPartner || legalData.hasPartner.length < 1) result.invalid++;
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardProfilePartner;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (legalData) {
      if (legalData.hasPartner && legalData.hasPartner.indexOf(1) > -1) {
        dispatch(changeMyPartnerState());
      } else {
        dispatch(changeMyPartnerState(false));
      }
    }
  }, [legalData, dispatch]);

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
            t(`${cardName}.closedText`) +
            `: ` +
            (legalData.hasPartner && t(`${cardName}.answers.${legalData.hasPartner[0] - 1}`))
          }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
                <CardQuestion>{t(`${cardName}.question`)}</CardQuestion>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1} force={true}>
                <KRadio
                  name={'hasPartner'}
                  label={t(`${cardName}.question`)}
                  noLabel
                  itemsName={[0, 1].map((e) => {
                    return t(`${cardName}.answers.${e}`);
                  })}
                  itemsValue={[1, 2]}
                  fieldValue={legalData.hasPartner}
                  setFieldValue={(name: string, value: number[]) => {
                    // if (!value || ( value[0] !== 2 || window.confirm(t(`${cardName}.disablePartnerQuestion`) ) ) ) {
                    props.setFieldValue(name, value);
                    // }
                  }}
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
