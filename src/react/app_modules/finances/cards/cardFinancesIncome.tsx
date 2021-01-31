import React from 'react';

import { KFormCard, KRadio, KNumber, KSelect } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import { CardHeading } from '../../../components/common/styled';
import showNum from '../../../utils/showNum';
import useCardValidation from '../../../utils/useCardValidation';

class CardFinancesIncome {
  constructor() {
    this.name = 'card_finances_income_1';
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 1;
      if (legalData.incomeType && legalData.incomeType.length > 0) {
        if( legalData.incomeType.indexOf(3) === -1 ){
          result.total += 1
          if (!legalData.incomeValue) result.invalid++;
        }else{
          legalData.incomeValue = 0;
        }
        if (legalData.incomeType.indexOf(1) > -1) {
          result.total += 2;
          if (!legalData.incomeCycle) result.invalid++;
          if (!legalData.incomeWorkload) result.invalid++;
          if (legalData.incomeCycle && legalData.incomeCycle.indexOf(99) > -1) {
            result.total += 1;
            if (!legalData.incomeCycleOther) result.invalid++;
          } else {
            legalData.incomeCycleOther = '';
          }
          legalData.incomeHours = '';
          legalData.incomeHoursCycle = [];
        } else if (legalData.incomeType.indexOf(2) > -1) {
          result.total += 2;
          if (!legalData.incomeHoursCycle) result.invalid++;
          if (!legalData.incomeHours) result.invalid++;
          legalData.incomeCycle = [];
          legalData.incomeCycleOther = '';
          legalData.incomeWorkload = '';
        }
      } else {
        result.invalid++;
      }

      result.done = result.invalid === 0;
      return result;
    };
    this.card = CardComponent;
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardFinancesIncome;

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
            t(`${cardName}.incomeTypes.${legalData.incomeType && legalData.incomeType[0] - 1}`) +
            ( legalData.incomeValue ? `: ` + showNum(legalData.incomeValue) : '' )
          }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
                <CardHeading>{t(`${cardName}.incomeTitle`)}</CardHeading>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KRadio
                  name={'incomeType'}
                  label={''}
                  noLabel
                  itemsName={[0, 1, 2].map((e) => {
                    return t(`${cardName}.incomeTypes.${e}`);
                  })}
                  itemsValue={[1, 2, 3]}
                  fieldValue={legalData.incomeType}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>

            {legalData.incomeType && legalData.incomeType.indexOf(3) === -1 ? (
              <>
                <KFormRow>
                  <KFormCol width={1 / 2} force={true}>
                    <KNumber
                      name={'incomeValue'}
                      label={
                        legalData.incomeType.indexOf(3) === -1
                          ? t(`${cardName}.incomeTypes.${legalData.incomeType - 1}`)
                          : t(`${cardName}.incomeYear`)
                      }
                      fieldValue={legalData.incomeValue}
                      setFieldValue={props.setFieldValue}
                    />
                  </KFormCol>
                </KFormRow>

                {legalData.incomeType.indexOf(1) > -1 ? (
                  <KFormRow>
                    <KFormCol width={1 / 2} force={true}>
                      <KSelect
                        name={'incomeCycle'}
                        label={t(`${cardName}.incomeCycle`)}
                        itemsName={[0, 1, 2, 3].map((e) => {
                          return t(`${cardName}.incomeCycles.${e}`);
                        })}
                        itemsValue={[12, 13, 14, 99]}
                        fieldValue={legalData.incomeCycle}
                        setFieldValue={props.setFieldValue}
                      />
                    </KFormCol>
                    <KFormCol width={1 / 2} force={true}>
                      <KNumber
                        name={'incomeWorkload'}
                        label={t(`${cardName}.incomeWorkload`)}
                        fieldValue={legalData.incomeWorkload}
                        setFieldValue={props.setFieldValue}
                        isPercent
                      />
                    </KFormCol>
                  </KFormRow>
                ) : (
                  ''
                )}

                {legalData.incomeCycle && legalData.incomeCycle.indexOf(99) > -1 ? (
                  <KFormRow>
                    <KFormCol width={1 / 2} force={true}>
                      <KNumber
                        name={'incomeCycleOther'}
                        label={t(`${cardName}.incomeCycleOther`)}
                        fieldValue={legalData.incomeCycleOther}
                        setFieldValue={props.setFieldValue}
                      />
                    </KFormCol>
                    <KFormCol width={1/2} force={true}></KFormCol>
                  </KFormRow>
                ) : (
                  ''
                )}

                {legalData.incomeType.indexOf(2) > -1 ? (
                  <KFormRow>
                    <KFormCol width={1 / 2} force={true}>
                      <KSelect
                        name={'incomeHoursCycle'}
                        label={t(`${cardName}.incomeHoursCycle`)}
                        itemsName={[0, 1].map((e) => {
                          return t(`${cardName}.incomeHoursCycles.${e}`);
                        })}
                        itemsValue={[365, 52]}
                        fieldValue={legalData.incomeHoursCycle}
                        setFieldValue={props.setFieldValue}
                      />
                    </KFormCol>
                    <KFormCol width={1 / 2} force={true}>
                      <KNumber
                        name={'incomeHours'}
                        label={t(`${cardName}.incomeHours`)}
                        fieldValue={legalData.incomeHours}
                        setFieldValue={props.setFieldValue}
                        showNum={false}
                        decimal={1}
                      />
                    </KFormCol>
                  </KFormRow>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </KFormSection>
        </KFormCard>
      ) : (
        ''
      )}
    </>
  );
};
