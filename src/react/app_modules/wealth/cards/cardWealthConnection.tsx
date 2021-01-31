import React from 'react';

import { KFormCard, KRadio, KNumber } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from '../../module.interfaces';
import { GeneralText, CardHeading } from '../../../components/common/styled';
import { useStore } from 'react-redux';
import useCardValidation from '../../../utils/useCardValidation';

class CardWealthConnection {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 1;
      if( legalData.hasWealth && legalData.hasWealth.length ){ 
        if( legalData.hasWealth[0] === 1 ){
          result.total += 1; 
          if( !legalData.wealthBase ) result.invalid++;
        }
      }else{
        result.invalid++;
      }
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardWealthConnection;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t } = props;

  const state = useStore().getState();

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
          closedText={ legalData.hasWealth && t(`${cardName}.title`, { name1: state.myPerson.firstName, name2: state.myPartner.firstName } ) + `: ` + 
            ( legalData.hasWealth[0] === 1 ? legalData.wealthBase : t(`${cardName}.hasWealthAnswers.${legalData.hasWealth[0] - 1}`) ) }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
                <CardHeading>{t(`${cardName}.title`, { name1: state.myPerson.firstName, name2: state.myPartner.firstName })}</CardHeading>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <GeneralText>{t(`${cardName}.hasWealthQuestion`)}</GeneralText>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KRadio
                  name={'hasWealth'}
                  label={t(`${cardName}.hasWealthQuestion`)}
                  noLabel
                  itemsName={[0, 1].map((e) => {
                    return t(`${cardName}.hasWealthAnswers.${e}`);
                  })}
                  itemsValue={[1, 2]}
                  fieldValue={legalData.hasWealth}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            { legalData.hasWealth && legalData.hasWealth[0] === 1 ? (
            <>
            <KFormRow>
              <KFormCol width={1}>
                <KNumber
                  name={'wealthBase'}
                  label={t(`${cardName}.wealthBase`)}
                  fieldValue={legalData.wealthBase}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            </>
            ) : '' }
          </KFormSection>
        </KFormCard>
      ) : (
        ''
      )}
    </>
  );
};
