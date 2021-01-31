import React, { useEffect } from 'react';

import { KFormCard, KNumber, KSlider } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from '../../module.interfaces';
import { GeneralText, CardHeading } from '../../../components/common/styled';
import { useSelector } from 'react-redux';
import { constantNumbers } from '../../../utils/calculators';
import showNum from '../../../utils/showNum';
import useCardValidation from '../../../utils/useCardValidation';

class CardNeedPension {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 2;
      if (!legalData.retirementStart) result.invalid++;
      if (!legalData.retirementNeed || parseInt(legalData.retirementNeed) < 1) result.invalid++;
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardNeedPension;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t, target, setFieldValue } = props;
  const person = useSelector<{ [target: string]: any }, any>((state) => target && state[target]);
  const fullName = person && person.fullName ? person.fullName() : '';

  const defaultRetirement: number = constantNumbers.defaultPension[person.gender[0] - 1] || 0;
  const minRetirementStart: number = defaultRetirement - 7;
  const maxRetirementStart: number = defaultRetirement + 5;

  const resultFinances = person.result.finances;
  const legalFinances = person.legal.finances;
  const currentIncome: number = resultFinances.incomeMonth || 0;
  let inclusiveText = '';
  if( legalFinances && resultFinances ) {
    if( legalFinances.incomeType && legalFinances.incomeType[0] === 1 ){
      const incomeCycle: number = legalFinances.incomeCycle ? legalFinances.incomeCycle[0] : 0;  
      const inclusive: string = !incomeCycle || incomeCycle === 12 || incomeCycle === 99 ? '' : incomeCycle.toString();
      const all: boolean = incomeCycle === 99 && legalFinances.incomeCycleOther ? true : false;
      inclusiveText = inclusive ? t(`totalIncomeInclusive`, {value: inclusive} ) : all ? t(`totalIncomeAll`) : '';
    }
  }

  useEffect(() => {
    if (legalData && (legalData.retirementStart === undefined || legalData.retirementStart === null)) {
      setFieldValue('retirementStart', defaultRetirement);
    }
  }, [legalData, defaultRetirement, setFieldValue]);

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
            start: legalData.retirementStart,
            need: showNum(legalData.retirementNeed)
          })}
          acceptButtonPosition="center"
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
                <CardHeading>{`${t(`${cardName}.title`)} ${fullName}`}</CardHeading>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <GeneralText>{t(`${cardName}.retirementStartQuestion`)}</GeneralText>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}></KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KSlider
                  name={'retirementStart'}
                  min={minRetirementStart}
                  max={maxRetirementStart}
                  step={1}
                  markStep={10}
                  autoHideLabel={false}
                  marks={true}
                  defaultValue={defaultRetirement}
                  fieldValue={legalData.retirementStart}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <GeneralText>{ 
                 ( currentIncome ? 
                  t(`totalIncome`, { value: showNum(currentIncome), inclusive: inclusiveText }) :
                  t(`noIncome`) ) 
                  + ' ' +  t(`${cardName}.totalIncomeQuestion`) }</GeneralText>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1 / 2} force={true}>
                <KNumber
                  name={'retirementNeed'}
                  label={t(`${cardName}.retirementNeed`)}
                  fieldValue={legalData.retirementNeed}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
              <KFormCol width={1 / 2} force={true} alignItems="center">
                <GeneralText noMargin>
                  { currentIncome ? 
                  t(`${cardName}.needAdvice`, { recommend: showNum(Math.round(currentIncome * 0.9)) }) : 
                  '' }
                </GeneralText>
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
