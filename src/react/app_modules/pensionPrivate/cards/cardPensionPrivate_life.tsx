import React from 'react';

import { KFormCard, KRadio, KNumber, KSelect, KText, KFormListArray, KCheck, KFormOptional, KDatePicker, KSwitch } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import { CardHeading, GeneralText } from '../../../components/common/styled';
import useCardValidation from '../../../utils/useCardValidation';
import { useMemoizedCallback } from '../../../utils/customCallbackHook';
import useEffectOnlyOnce from '../../../utils/useEffectOnlyOnce';

class CardPensionPrivate {
  constructor() {
    this.name = 'card_pensionprivate_life_1';
    this.validate = (legalData: any, mode: number) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if(!legalData) return result;
      result.total+=2;
      if(!legalData.name) result.invalid++;
      if(!legalData.mainStart) result.invalid++;
      if(!legalData.mainEnd) result.invalid++;
      if(!legalData.type || (legalData.type && legalData.type.length === 0)) result.invalid++;
      if( mode === 1 ){
        result.total += 1;
        if(legalData.hasCapital){
          if(legalData.hasCapital[0] === 1){
              result.total += 1;
              if(legalData.capitalType){
                if(legalData.capitalType[0] === 2){
                  result.total += 1;
                  if(legalData.capitalOption){
                    if(legalData.capitalOption[0] === 1){
                    }
                    else if(legalData.capitalOption[0] === 2 || legalData.capitalOption[0] === 3){
                      result.total += 1;
                      if(!legalData.capitalValue) result.invalid++;
                    }else{
                      result.invalid++;
                    }
                  }
                }else{
                  result.total += 1;
                  if(!legalData.capitalValue) result.invalid++;
                }
              }else{
                result.invalid++;
              }
          }
          if(legalData.capitalCustomDate){
            if(!legalData.capitalStart) result.invalid++;
            if(!legalData.capitalEnd) result.invalid++;
          }
        }else{
          result.invalid++;
        }
        
      }
      else if( mode === 2 ){
        if(legalData.hasDisability){
          result.total += 1;
          if(legalData.hasDisability[0] === 1){
            result.total += 1;
            if( legalData.disability && legalData.disability.length ){
              legalData.disability.forEach((e:any) => {
                result.total+=5;
                if(!e.value) result.invalid++;
                if(e.customDate){
                    result.total += 2;
                    if(!e.start) result.invalid++;
                    if(!e.end) result.invalid++;
                }
                if(!e.illness && !e.accident) result.invalid++;
                if(e.type){
                  if(e.type[0] === 1){
                    result.total+=2
                    if(!e.wait) result.invalid++;
                    if(!e.short) result.invalid++;
                    if(e.short && e.short[0] === 1 && !e.shortTime) result.invalid++;
                  }
                }else{
                  result.invalid++;
                }
              });
            }
          }
        }else{
          result.invalid++;
        }
      }
      else if( mode === 3 ){
        result.total += 1;
        if(legalData.hasLeftBehind){
          if(legalData.hasLeftBehind[0] === 1){
            result.total += 1;
            if( legalData.leftBehind && legalData.leftBehind.length ){
              legalData.leftBehind.forEach((e:any) => {
                result.total+=5;
                if(!e.value) result.invalid++;
                if(!e.type) result.invalid++;
                if(e.customDate){
                    result.total += 2;
                    if(!e.start) result.invalid++;
                    if(!e.end) result.invalid++;
                }
                if(!e.illness && !e.accident) result.invalid++;
              });
            }
          }
        }else{
          result.invalid++;
        }
      }
      result.done = result.invalid === 0;
      return result;
    };
    this.card = CardComponent;
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any, mode:number) => ProgressResult_Props;
}

const validateDisabilityBlock = (block:any) => {
  let valid = true;
  ['value','type'].forEach((k:string)=>{
    if(!block[k]) valid = false;
  }) 
  if(block.customDate){
    if(!block.start || !block.end) valid = false;
  }
  if(block.type && block.type[0] === 1){
    if(!block.wait || !block.short ||
      (block.short && block.short[0] === 1 && !block.shortTime))
      valid = false; }
       
  if (!block.illness && !block.accident) valid = false;
  return valid;
}

const validateLeftBehindBlock = (block:any) => {
  let valid = true;
  ['value','type'].forEach((k:string)=>{
    if(!block[k]) valid = false;
  })
  if(block.customDate){
    if(!block.start || !block.end) valid = false;
  }
  if(!block.illness && !block.accident) valid = false;
  return valid;
}

export default CardPensionPrivate;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t, mode } = props;

  useEffectOnlyOnce(()=>{
    if(legalData && !legalData.name){
      props.setFieldValue('name',t(`${cardName}.defaultName`) + ' ' + legalData.initIndex);
    }
  });

  useCardValidation(props);
  
  const renderElements = useMemoizedCallback(()=> { 
      switch(mode){
        case 1 : return(
        <>
        <M1Capital/>
        <KFormOptional
          title={t(`${cardName}.optionalTitle`)}>
          <M2Disability /> 
          <M3LeftBehind /> 
        </KFormOptional>
        </>
        ) 
        case 2 : return(
        <>
        <M2Disability />
        <KFormOptional
          title={t(`${cardName}.optionalTitle`)}>
          <M1Capital /> 
          <M3LeftBehind /> 
        </KFormOptional>
        </> 
        ) 
        case 3 : return(
        <>
        <M3LeftBehind />
        <KFormOptional
          title={t(`${cardName}.optionalTitle`)}>
          <M1Capital /> 
          <M2Disability /> 
        </KFormOptional>
        </> )
      }
  },[mode]);

  if(!legalData) return(<></>);


  const M1Capital = () => (
    <>
      <KFormRow>
        <KFormCol width={1}>
          <GeneralText>{t(`${cardName}.hasCapitalQuestion`,{name:legalData.name} )}</GeneralText>
        </KFormCol>
      </KFormRow>
      <KFormRow>
        <KFormCol width={1}>
          <KRadio
            name={'hasCapital'}
            label={t(`${cardName}.hasCapital`)}
            noLabel
            itemsName={[0, 1].map((e) => {
              return t(`${cardName}.hasCapitalItems.${e}`);
            })}
            itemsValue={[1, 2]}
            fieldValue={legalData.hasCapital}
            setFieldValue={props.setFieldValue}
          />
        </KFormCol>
      </KFormRow>
      { legalData.hasCapital && legalData.hasCapital[0] === 1 ? (
        <>
        <KFormRow>
          <KFormCol width={1}>
            <GeneralText>{t(`${cardName}.capitalType`)}</GeneralText>
          </KFormCol>
        </KFormRow>
        <KFormRow>
          <KFormCol width={1}>
            <KRadio
              name={'capitalType'}
              label={t(`${cardName}.capitalType`)}
              noLabel
              itemsName={[0, 1].map((e) => {
                return t(`${cardName}.capitalTypeItems.${e}`);
              })}
              itemsValue={[1, 2]}
              fieldValue={legalData.capitalType}
              setFieldValue={props.setFieldValue}
            />
          </KFormCol>
        </KFormRow>
        { legalData.capitalType && legalData.capitalType[0] === 2 ? (
        <>
        <KFormRow>
          <KFormCol width={1}>
            <GeneralText>{t(`${cardName}.capitalOption`)}</GeneralText>
          </KFormCol>
        </KFormRow>
        <KFormRow>
          <KFormCol width={1}>
            <KRadio
              name={'capitalOption'}
              label={t(`${cardName}.capitalOption`)}
              noLabel
              itemsName={[0, 1, 2].map((e) => {
                return t(`${cardName}.capitalOptionItems.${e}`);
              })}
              itemsValue={[1, 2, 3]}
              fieldValue={legalData.capitalOption}
              setFieldValue={props.setFieldValue}
            />
          </KFormCol>
        </KFormRow>
        </>
        ) : '' }
        { legalData.capitalType && 
          ( legalData.capitalType[0] === 1 || 
            ( legalData.capitalType[0] === 2 && 
              legalData.capitalOption && legalData.capitalOption[0] !== 1  ) 
            ) ? 
            (
            <> 
            <KFormRow>
              <KFormCol width={1}>
                <KNumber
                  name={'capitalValue'}
                  label={t(`${cardName}.capitalValue`)}
                  fieldValue={legalData.capitalValue}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            </>
            ) : '' }
            { legalData.capitalOption && legalData.capitalOption[0] !== 1 ? (
              <KFormRow>
                <GeneralText>{t(`${cardName}.capitalInformation.${legalData.capitalOption[0] -1}`)}</GeneralText>
              </KFormRow>
            ) : '' }
            <KFormRow>
              <KFormCol width={1}>
                <KSwitch
                  name={'capitalCustomDate'}
                  label={t(`${cardName}.customDate`)}
                  fieldValue={legalData.capitalCustomDate}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            { legalData.capitalCustomDate ? (
            <KFormRow>
                <KFormCol width={1 / 2} force={true}>
                <KDatePicker
                  name={'capitalStart'}
                  label={t(`${cardName}.start`)}
                  fieldValue={legalData.capitalStart}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
                <KFormCol width={1 / 2} force={true}>
                <KDatePicker
                  name={'capitalEnd'}
                  label={t(`${cardName}.end`)}
                  fieldValue={legalData.capitalEnd}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            ): ''}
            </>
      ) : '' }
    </>
  );

  
  const M2Disability = () => (
    <>
    <KFormRow>
      <KFormCol width={1}>
        <GeneralText>{t(`${cardName}.hasDisabilityQuestion`,{name:legalData.name})}</GeneralText>
      </KFormCol>
    </KFormRow>
      <KFormRow>
        <KFormCol width={1}>
          <KRadio
            name={'hasDisability'}
            label={t(`${cardName}.hasDisability`)}
            noLabel
            itemsName={[0, 1].map((e) => {
              return t(`${cardName}.hasDisabilityItems.${e}`);
            })}
            itemsValue={[1, 2]}
            fieldValue={legalData.hasDisability}
            setFieldValue={props.setFieldValue}
          />
        </KFormCol>
      </KFormRow>
      { legalData.hasDisability && legalData.hasDisability[0] === 1 ? (
        <>
        <KFormListArray
          name={'disability'}
          array={legalData.disability}
          layout={'numbered'}
          modalTitle={t(`${cardName}.disabilityModalTitle`)}
          setFieldValue={props.setFieldValue}
          toggleHelp={props.toggleHelp}
          showParams={[
            {name:'illness', type: 'item', items: [t(`${cardName}.illness`)]  },
            {name:'accident', type: 'item', items: [t(`${cardName}.accident`)]  },
            {name:'value', type: 'value' }
          ]}
          customParams={{
            addButtonText: t(`${cardName}.disabilityAddButton`),
            modalWarningElement: t(`${cardName}.disabilityElement`),
            validateElements: true,
            validateElementFunc: validateDisabilityBlock
          }}
        > 
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText>{t(`${cardName}.subType`)}</GeneralText>
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <KRadio
                name={'type'}
                label={t(`${cardName}.subType`)}
                noLabel
                itemsName={[0, 1].map((e) => {
                  return t(`${cardName}.subTypeItems.${e}`);
                })}
                itemsValue={[1, 2]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[2]]}>
            <KFormCol width={1/2}>
              <KNumber
                name={'value'}
                label={t(`${cardName}.value`)}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[1]]}>
            <KFormCol width={1/2}>
              <KNumber
                name={'value'}
                label={t(`${cardName}.value`)}
              />
            </KFormCol>
            <KFormCol width={1/2}>
              <KRadio
                name={'cycle'}
                label={t(`${cardName}.cycle`)}
                noLabel
                itemsName={[0, 1].map((e) => {
                  return t(`${cardName}.cycleItems.${e}`);
                })}
                itemsValue={[1, 2]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[1]]}>
            <KFormCol width={1/2}>
              <KNumber
                name={'wait'}
                label={t(`${cardName}.disabilityWait`)}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText>{t(`${cardName}.cases`)}</GeneralText>
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1/2}>
              <KCheck
                name={`illness`}
                noLabel
                itemsValue={[1]}
                itemsName={[t(`${cardName}.illness`)]}
              />
            </KFormCol>
            <KFormCol width={1/2}>
              <KCheck
                name={`accident`}
                noLabel
                itemsValue={[1]}
                itemsName={[t(`${cardName}.accident`)]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[1]]}>
            <KFormCol width={1}>
              <GeneralText>{t(`${cardName}.disabilityShortQuestion`)}</GeneralText>
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[1]]}>
            <KFormCol width={1}>
              <KRadio
                name={'short'}
                noLabel
                itemsName={[0, 1].map((e) => {
                  return t(`${cardName}.disabilityShortItems.${e}`);
                })}
                itemsValue={[1, 2]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
              conditionName={'short'}
              conditionValues={[[1]]}>
            <KFormCol width={1/2}>
              <KNumber
                name={'shortTime'}
                label={t(`${cardName}.disabilityShortTime`)}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <KSwitch
                name={'customDate'}
                label={t(`${cardName}.customDate`)}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'customDate'}
            conditionValues={[true]}>
              <KFormCol width={1 / 2} force={true}>
              <KDatePicker
                name={'start'}
                label={t(`${cardName}.start`)}
              />
            </KFormCol>
              <KFormCol width={1 / 2} force={true}>
              <KDatePicker
                name={'end'}
                label={t(`${cardName}.end`)}
              />
            </KFormCol>
          </KFormRow>
        </KFormListArray>
        </>
      ) : '' }
    </>
  );

  const M3LeftBehind = () => (
    <>
      <KFormRow>
        <KFormCol width={1}>
          <GeneralText>{t(`${cardName}.hasLeftBehindQuestion`,{name:legalData.name})}</GeneralText>
        </KFormCol>
      </KFormRow>
      <KFormRow>
        <KFormCol width={1}>
          <KRadio
            name={'hasLeftBehind'}
            label={t(`${cardName}.hasLeftBehind`)}
            noLabel
            itemsName={[0, 1].map((e) => {
              return t(`${cardName}.hasLeftBehindItems.${e}`);
            })}
            itemsValue={[1, 2]}
            fieldValue={legalData.hasLeftBehind}
            setFieldValue={props.setFieldValue}
          />
        </KFormCol>
      </KFormRow>
      { legalData.hasLeftBehind && legalData.hasLeftBehind[0] === 1 ? (
        <>
        <KFormListArray
          name={'leftBehind'}
          array={legalData.leftBehind}
          layout={'numbered'}
          modalTitle={t(`${cardName}.leftBehindModalTitle`)}
          setFieldValue={props.setFieldValue}
          toggleHelp={props.toggleHelp}
          showParams={[
            {name:'illness', type: 'item', items: [t(`${cardName}.illness`)]  },
            {name:'accident', type: 'item', items: [t(`${cardName}.accident`)]  },
            {name:'value', type: 'value' }
          ]}
          customParams={{
            addButtonText: t(`${cardName}.leftBehindAddButton`),
            modalWarningElement: t(`${cardName}.leftBehindElement`),
            validateElements: true,
            validateElementFunc: validateLeftBehindBlock
          }}
        >
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText>{t(`${cardName}.subType`)}</GeneralText>
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <KRadio
                name={'type'}
                label={t(`${cardName}.subType`)}
                noLabel
                itemsName={[0, 1].map((e) => {
                  return t(`${cardName}.subTypeItems.${e}`);
                })}
                itemsValue={[1, 2]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[2]]}>
            <KFormCol width={1/2}>
              <KNumber
                name={'value'}
                label={t(`${cardName}.value`)}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'type'}
            conditionValues={[[1]]}>
            <KFormCol width={1/2}>
              <KNumber
                name={'value'}
                label={t(`${cardName}.value`)}
              />
            </KFormCol>
            <KFormCol width={1/2}>
              <KRadio
                name={'cycle'}
                label={t(`${cardName}.cycle`)}
                noLabel
                itemsName={[0, 1].map((e) => {
                  return t(`${cardName}.cycleItems.${e}`);
                })}
                itemsValue={[1, 2]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText>{t(`${cardName}.cases`)}</GeneralText>
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1/2}>
              <KCheck
                noLabel
                name={`illness`}
                itemsValue={[1]}
                itemsName={[t(`${cardName}.illness`)]}
              />
            </KFormCol>
            <KFormCol width={1/2}>
              <KCheck
                noLabel
                name={`accident`}
                itemsValue={[1]}
                itemsName={[t(`${cardName}.accident`)]}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <KSwitch
                name={'customDate'}
                label={t(`${cardName}.customDate`)}
              />
            </KFormCol>
          </KFormRow>
          <KFormRow
            conditionName={'customDate'}
            conditionValues={[true]}>
              <KFormCol width={1 / 2} force={true}>
              <KDatePicker
                name={'start'}
                label={t(`${cardName}.start`)}
              />
            </KFormCol>
              <KFormCol width={1 / 2} force={true}>
              <KDatePicker
                name={'end'}
                label={t(`${cardName}.end`)}
              />
            </KFormCol>
          </KFormRow>
        </KFormListArray>
        </>
      ) : '' }
    </>
  );


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
            closedText={ legalData.name }
            customParams={props.customParams}
          >
            <KFormSection>
              <KFormRow>
                <KFormCol width={1}>
                  <CardHeading>{t(`${cardName}.title`)}</CardHeading>
                </KFormCol>
              </KFormRow>
              <KFormRow>
                <KFormCol width={1/2}>
                  <KText
                    name={'name'}
                    label={t(`${cardName}.name`)}
                    fieldValue={legalData.name}
                    setFieldValue={props.setFieldValue}
                  />
                </KFormCol>
                <KFormCol width={1/2}>
                  <KSelect
                    name={'type'}
                    label={t(`${cardName}.type`)}
                    itemsName={[0, 1].map((e) => {
                      return t(`${cardName}.typeItems.${e}`);
                    })}
                    itemsValue={[1, 2]}
                    fieldValue={legalData.type}
                    setFieldValue={props.setFieldValue}
                  />
                </KFormCol>
              </KFormRow>
              <KFormRow>
                <KFormCol width={1}>
                  <GeneralText>{t(`${cardName}.timeFrame`)}</GeneralText>
                </KFormCol>
              </KFormRow>
              <KFormRow>
                  <KFormCol width={1 / 2} force={true}>
                  <KDatePicker
                    name={'mainStart'}
                    label={t(`${cardName}.start`)}
                    fieldValue={legalData.mainStart}
                    setFieldValue={props.setFieldValue}
                  />
                </KFormCol>
                  <KFormCol width={1 / 2} force={true}>
                  <KDatePicker
                    name={'mainEnd'}
                    label={t(`${cardName}.end`)}
                    fieldValue={legalData.mainEnd}
                    setFieldValue={props.setFieldValue}
                  />
                </KFormCol>
              </KFormRow>
              { renderElements() }
            </KFormSection>
          </KFormCard>
          ) : 
          ''
          }
    </>
  );
};
