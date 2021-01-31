import React from 'react';

import { KFormCard, KRadio, KNumber, KSelect, KDatePicker } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import { GeneralText, CardHeading, CardQuestion } from '../../../components/common/styled';
import KFieldArray from '../../../components/KForm/KFieldArray';
import useCardValidation from '../../../utils/useCardValidation';
import { useStore } from 'react-redux';

class CardPensionWorkUVG {
  constructor() {
    this.name = '';
    this.validate = (legalData: any, mode: number, person: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      if( person && person.legal && person.legal.finances && person.legal.finances.incomeType && person.legal.finances.incomeType[0] === 3 ){
        result.done = true; return result;
      }
      result.total = 1;
      if (legalData.uvgDetailed && legalData.uvgDetailed.length > 0) {
        if (legalData.uvgDetailed.indexOf(2) > -1) {
          legalData.uvgAccident = [];
          legalData.uvgDisablity = '';
          result.total += 1;
          if (legalData.uvgCut && legalData.uvgCut.length > 0){
            result.total += 1;
            if(legalData.uvgCut.indexOf(2) > -1){
              if(legalData.uvgContract && legalData.uvgContract.length > 0){
                result.total += 1;
                if(legalData.uvgContract.indexOf(1) > -1){
                  legalData.uvgStart = '';
                  if(!legalData.uvgBranch || !legalData.uvgBranch.length ) result.invalid++;
                }else{
                  legalData.uvgBranch = [];
                  if(!legalData.uvgStart) result.invalid++;
                }
              }else{
                legalData.uvgBranch = [];
                legalData.uvgStart = ''; 
                result.invalid++;
              }
            }else{
              legalData.uvgContract = [];
              legalData.uvgBranch = [];
              legalData.uvgStart = ''; 
            }
          }else{
            legalData.uvgContract = [];
            legalData.uvgBranch = [];
            legalData.uvgStart = '';
            result.invalid++; 
          }
        } else if (legalData.uvgDetailed.indexOf(1) > -1){ 
          legalData.uvgCut = [];
          legalData.uvgContract = [];
          legalData.uvgBranch = [];
          legalData.uvgStart = '';
          result.total += 2;
          if( legalData.uvgAccident && legalData.uvgAccident.length > 0){
            legalData.uvgAccident.forEach((e:any)=>{
              result.total += 3;
              if( !e.from ) result.invalid++;
              if( !e.till ) result.invalid++;
              if( !e.percent ) result.invalid++;
            });
          }else{
            result.invalid++
          }
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
  validate: (legalData: any, mode: number, person: any) => ProgressResult_Props;
}

export default CardPensionWorkUVG;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, target, t } = props;
  const state = useStore().getState();
  const person = props.target && state[props.target];

  const setUVG = (name:string, array:any[]) => {
    props.setFieldValue(name, array );
  }

  useCardValidation(props, person);

  let hasIncome = false;
  if( person && person.legal && person.legal.finances && person.legal.finances.incomeType && person.legal.finances.incomeType[0] !== 3 ){
    hasIncome = true;
  }

  return (
    <>
      {legalData && hasIncome ? (
        <KFormCard
          id={props.id}
          cardName={cardName}
          cardNumber={props.cardNumber}
          state={props.isCardValid}
          disabled={props.disabled}
          handleApprove={props.handleApprove}
          toggleHelp={props.toggleHelp}
          position={props.position}
          closedText={ legalData.uvgDetailed ? t(`${cardName}.detailedItems.${legalData.uvgDetailed[0]-1}`) : "?"
          }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
              <CardHeading>{t(`${cardName}.title`)}</CardHeading>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KRadio
                  name={'uvgDetailed'}
                  label={t(`${cardName}.detailed`)}
                  noLabel
                  itemsName={[0, 1, 2].map((e) => {
                    return t(`${cardName}.detailedItems.${e}`);
                  })}
                  itemsValue={[1, 2, 3]}
                  fieldValue={legalData.uvgDetailed}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>

            {legalData.uvgDetailed && legalData.uvgDetailed.indexOf(2) > -1 ? (
              <>
              <KFormRow>
                <KFormCol width={1}>
                  <CardQuestion>{t(`${cardName}.cut`)}</CardQuestion>
                </KFormCol>
              </KFormRow>
              <KFormRow>
                <KFormCol width={1}>
                  <KRadio
                    name={'uvgCut'}
                    label={t(`${cardName}.cut`)}
                    noLabel
                    itemsName={[0, 1].map((e) => {
                      return t(`${cardName}.cutItems.${e}`);
                    })}
                    itemsValue={[1, 2]}
                    fieldValue={legalData.uvgCut}
                    setFieldValue={props.setFieldValue}
                  />
                </KFormCol>
              </KFormRow>

              { legalData.uvgCut && legalData.uvgCut.indexOf(2) > -1 ? (
                <>
                <KFormRow>
                  <KFormCol width={1}>
                    <CardQuestion>{t(`${cardName}.contract`)}</CardQuestion>
                  </KFormCol>
                </KFormRow>
                <KFormRow>
                  <KFormCol width={1}>
                    <KRadio
                      name={'uvgContract'}
                      label={t(`${cardName}.contract`)}
                      noLabel
                      itemsName={[0, 1].map((e) => {
                        return t(`${cardName}.contractItems.${e}`);
                      })}
                      itemsValue={[1, 2]}
                      fieldValue={legalData.uvgContract}
                      setFieldValue={props.setFieldValue}
                    />
                  </KFormCol>
                </KFormRow>
                { legalData.uvgContract && legalData.uvgContract.indexOf(1) > -1 ? (
                  <>
                  <KFormRow>
                    <KFormCol width={1 / 2} force={true}>
                      <KSelect
                        name={'uvgBranch'}
                        label={t(`${cardName}.branch`)}
                        itemsName={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((e) => {
                          return t(`${cardName}.branchItems.${e}`);
                        })}
                        itemsValue={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
                        fieldValue={legalData.uvgBranch}
                        setFieldValue={props.setFieldValue}
                      />
                    </KFormCol>
                  </KFormRow>
                  </>
                ) : '' }
                { legalData.uvgContract && legalData.uvgContract.indexOf(2) > -1 ? (
                  <>
                  <KFormRow>
                    <KFormCol width={1}>
                      <CardQuestion>{t(`${cardName}.start`)}</CardQuestion>
                    </KFormCol>
                  </KFormRow>
                  <KFormRow>
                    <KFormCol width={1 / 2} force={true}>
                      <KDatePicker
                        name={'uvgStart'}
                        label={t(`${cardName}.startDate`)}
                        fieldValue={legalData.uvgStart}
                        setFieldValue={props.setFieldValue}
                      />
                    </KFormCol>
                  </KFormRow>
                  </> 
                ) : '' }
              </> ) : '' }
            </> ) : '' }

            { legalData.uvgDetailed && legalData.uvgDetailed.indexOf(1) > -1 ? (
            <>
              <KFormRow>
                <KFormCol>
                  <CardQuestion>{t(`${cardName}.detailedQuestion`)}</CardQuestion>
                </KFormCol>
              </KFormRow>
              <KFieldArray
                name={'uvgIllness'}
                label={t(`${cardName}.illness`)}
                addText={t(`${cardName}.add`)}
                setFieldValue={setUVG}
                fieldValue={legalData.uvgIllness}
              >
                <KFormRow>
                  <KFormCol width={1 / 3} force={true}>
                    <KNumber
                      name={'from'}
                      label={t(`${cardName}.from`)}
                    />
                  </KFormCol>
                  <KFormCol width={1 / 3} force={true}>
                    <KNumber
                      name={'till'}
                      label={t(`${cardName}.till`)}
                    />
                  </KFormCol>
                  <KFormCol width={1 / 3} force={true}>
                    <KNumber
                      name={'percent'}
                      label={t(`${cardName}.percent`)}
                      isPercent
                    />
                  </KFormCol>
                </KFormRow>
              </KFieldArray>
              <KFieldArray
                name={'uvgAccident'}
                label={t(`${cardName}.accident`)}
                addText={t(`${cardName}.add`)}
                setFieldValue={setUVG}
                fieldValue={legalData.uvgAccident}
              >
                <KFormRow>
                  <KFormCol width={1 / 3} force={true}>
                    <KNumber
                      name={'from'}
                      label={t(`${cardName}.from`)}
                    />
                  </KFormCol>
                  <KFormCol width={1 / 3} force={true}>
                    <KNumber
                      name={'till'}
                      label={t(`${cardName}.till`)}
                    />
                  </KFormCol>
                  <KFormCol width={1 / 3} force={true}>
                    <KNumber
                      name={'percent'}
                      label={t(`${cardName}.percent`)}
                      isPercent
                    />
                  </KFormCol>
                </KFormRow>
              </KFieldArray>
              <KFormRow>
                <CardQuestion>{t(`${cardName}.disablity`)}</CardQuestion>
                <GeneralText>{t(`${cardName}.disablityMessage`)}</GeneralText>
              </KFormRow>
            </> ) : '' }

          </KFormSection>
        </KFormCard>
      ) : (
        <KFormCard
          id={props.id}
          cardName={props.cardName}
          cardNumber={props.cardNumber}
          state={true}
          disabled={props.disabled}
          handleApprove={props.handleApprove}
          toggleHelp={props.toggleHelp}
          position={props.position}
          closedText={ t(`${cardName}.noIncome`) }
        >
          <GeneralText>
            { t(`${cardName}.noIncomeMessage`) }
          </GeneralText>
        </KFormCard>
      )}
    </>
  );
};
