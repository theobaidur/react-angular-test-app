import React, { useEffect, useState, useRef, useCallback } from 'react';

import { KFormCard, KRadio, KNumber } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props, FieldValuePair } from '../../module.interfaces';
import { CardHeading, CardQuestion, GeneralText } from '../../../components/common/styled';
import { config } from '../../../config';
import { httpActions } from '../../../constants/enums';
import { PkAuszugResults } from '../../../components/common/pkAuszug';
import { PkScanResult } from '../../../components/common/pkAuszug/pkAuszug.interfaces';
import { PkScanResultComponent } from '../../../components/common/pkAuszug/pkAuszug.component';
import { OCRProcess } from '../../../components/common/ocrProcess';
import { useStore } from 'react-redux';
import authService from '../../../services/authService';
import scanProvider from '../../../providers/scanProvider';
import useCardValidation from '../../../utils/useCardValidation';
import useEffectOnlyOnce from '../../../utils/useEffectOnlyOnce';

// @ts-ignore
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import dateFromString from '../../../utils/dateFromString';

class CardPensionWork {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any, mode: number, person: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      if( person && person.legal && person.legal.finances && person.legal.finances.incomeType && person.legal.finances.incomeType[0] === 3 ){
        result.done = true; return result;
      }
      result.total = 1;
      if (legalData.detailed) {
        if (legalData.detailed.length < 1) result.invalid++;
        if (legalData.detailed.indexOf(1) > -1) {
          result.total += 1;
          if (legalData.mainType !== 'edit' && (!legalData.isScanReady || legalData.isScanReady === false))
            result.invalid++;
          if (legalData.mainType === 'edit') {
            if (legalData.pkAuszug) {
              result.total += 12;
              if (!legalData.pkAuszug.date) result.invalid++;
              if (!legalData.pkAuszug.company) result.invalid++;
              if (!legalData.pkAuszug.incomeyear) result.invalid++;
              if (!legalData.pkAuszug.incomeinsured) result.invalid++;
              if (!legalData.pkAuszug.workload) result.invalid++;
              if (!legalData.pkAuszug.creditbvg) result.invalid++;
              if (!legalData.pkAuszug.credittotal) result.invalid++;
              if (!legalData.pkAuszug.maxpayin) result.invalid++;
              if (!legalData.pkAuszug.gotwef && legalData.pkAuszug.gotwef !== 0) result.invalid++;
              if (!legalData.pkAuszug.maxwef && legalData.pkAuszug.maxwef !== 0) result.invalid++;
              if (!legalData.pkAuszug.widowvalue) result.invalid++;
              if (!legalData.pkAuszug.orphanvalue) result.invalid++;
              if (legalData.pkAuszug.retirement && legalData.pkAuszug.retirement.length > 0) {
                legalData.pkAuszug.retirement.forEach((e: any) => {
                  result.total += 3;
                  if (!e.pensionage) result.invalid++;
                  if (!e.pensionyear) result.invalid++;
                  if (!e.pensioncapital) result.invalid++;
                });
              }
              if (legalData.pkAuszug.disability && legalData.pkAuszug.disability.length > 0) {
                legalData.pkAuszug.disability.forEach((e: any) => {
                  result.total += 2;
                  if (!e.disvalue) result.invalid++;
                  if (!e.diswait) result.invalid++;
                  if (e.isChildAvailable) {
                    result.total += 1;
                    if (!e.dischild) result.invalid++;
                  }
                });
              }
              if (legalData.pkAuszug.deathBenefit && legalData.pkAuszug.deathBenefit.length > 0) {
                legalData.pkAuszug.deathBenefit.forEach((e: any) => {
                  result.total += 1;
                  if (!e.deathcapital) result.invalid++;
                });
              }
            }
          }
        } else if (legalData.detailed.indexOf(2) > -1) {
          if (!legalData.quick || !(legalData.quick.length > 0)) {
            result.invalid++;
          } else if (legalData.quick.indexOf(1) > -1) {
            if (!legalData.firstAge) result.invalid++;
          }
        }
      } else {
        result.invalid++;
      }
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any, mode: number, person: any) => ProgressResult_Props;
}

export default CardPensionWork;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t, setFieldValue, setFieldValues } = props;
  const state = useStore().getState();
  const person = props.target && state[props.target];
  const EventSourceWrapper = NativeEventSource ? NativeEventSource : EventSourcePolyfill;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [evtSource, setEvtSource] = useState<EventSource>();
  const [isAwaiting, setIsAwaiting] = useState<boolean>(false);

  const initDocScan = useCallback(() => {
    scanProvider.initDocScan(
      '',
      (res) => {
        setFieldValue('scanKey', res.code);
      },
      (err) => console.error(err)
    );
  }, [setFieldValue]);

  useEffectOnlyOnce(() => initDocScan());

  const scanKey = legalData && legalData.scanKey;
  useEffect(() => {
    if (scanKey) {
      const source = new EventSourceWrapper(
        `${config.monetoApiUrl}?action=${httpActions.AWAIT_DOCSCAN_RESULT}&key=${
          scanKey
        }&session=${authService.getSessionFromStorage()}`
      );
      source.onmessage = (event: any) => {
        if (event.data === 'done') {
          source.close();
          setIsOpen(true);
        }
      };
      source.onopen = (event: any) => {
        setIsAwaiting(true);
      };
      source.onerror = (event: any) => {
        if (source.readyState !== source.CONNECTING) {
          console.log('source.onerror -> setIsAwaiting', false, event);
          setIsAwaiting(false);
        } else {
          console.log('source.onerror -> reconnect', event);
        }
      };
      setEvtSource(source);
    }
  }, [scanKey,EventSourceWrapper]);

  useEffect(() => {
    if (evtSource) {
      return () => {
        if (evtSource) evtSource.close();
      };
    }
  }, [evtSource]);

  useCardValidation(props, person);

  const succesScanCallback = (key: string) => {
    return scanProvider.getDocScanResult(
      key,
      (res: any) => {
        return res;
      },
      (err: string) => console.error(err)
    );
  };

  const confirmData = (res: PkScanResult) => {
    setFieldValues([
      {
        name: 'pkAuszug',
        value: res
      },
      {
        name: 'isScanReady',
        value: true
      }
    ]);
    setIsOpen(false);
    if (kFormRef && kFormRef.current && kFormRef.current.handleApprove) kFormRef.current.handleApprove(true);
  };

  const addItemToList = (name: string) => {
    let state: PkScanResult = legalData && legalData.pkAuszug ? legalData.pkAuszug : {};
    state = { ...state, [name]: state[name] ? [...state[name], {}] : [{}] };
    setFieldValue('pkAuszug', state);
  };

  const removeItemFromList = (name: string, index: number) => {
    let state: PkScanResult = legalData && legalData.pkAuszug ? legalData.pkAuszug : {};
    let updatedList: Array<any> = state[name];
    updatedList.splice(index, 1);
    state = { ...state, [name]: updatedList };
    setFieldValue('pkAuszug', state);
  };

  const updateScanResult = (name: string, value: any) => {
    let state: PkScanResult = legalData && legalData.pkAuszug ? legalData.pkAuszug : {};
    const names: Array<string> = name.split('.');
    if (names.length === 1) {
      state = { ...state, [name]: value };
    } else if (names.length === 3) {
      let array: Array<any> = state[names[0]] as Array<any>;
      array[Number(names[1])] = { ...array[Number(names[1])], [names[2]]: value };
      state = { ...state, [names[0]]: array };
    }
    setFieldValue('pkAuszug', state);
  };

  const updateScanResults = (fieldValues: FieldValuePair[]) => {
    if (fieldValues && Array.isArray(fieldValues)) {
      let state: PkScanResult = legalData && legalData.pkAuszug ? legalData.pkAuszug : {};

      fieldValues.forEach((field) => {
        const names: Array<string> = field.name.split('.');
        if (names.length === 1) {
          state = { ...state, [field.name]: field.value };
        } else if (names.length === 3) {
          let array: Array<any> = state[names[0]] as Array<any>;
          array[Number(names[1])] = { ...array[Number(names[1])], [names[2]]: field.value };
          state = { ...state, [names[0]]: array };
        }
      });

      setFieldValue('pkAuszug', state);
    }
  };

  const onRescan = () => {
    setFieldValues([
      {
        name: 'pkAuszug',
        value: undefined
      },
      {
        name: 'isScanReady',
        value: false
      },
      {
        name: 'detailed',
        value: []
      }
    ]);
    initDocScan();
  };

  const kFormRef = useRef<any>();

  // Compatibility
  if( legalData && legalData.quickYear && !legalData.firstAge && person ){
    const birth = dateFromString(person.birthDate);
    const age = legalData.quickYear-birth.getFullYear();
    legalData.firstAge = age;
  }

  let hasIncome = false;
  if( person && person.legal && person.legal.finances && person.legal.finances.incomeType && person.legal.finances.incomeType[0] !== 3 ){
    hasIncome = true;
  }

  return (
    <>
      {legalData && hasIncome ? (
        <KFormCard
          id={props.id}
          cardName={props.cardName}
          cardNumber={props.cardNumber}
          ref={kFormRef}
          state={props.isCardValid}
          disabled={props.disabled}
          handleApprove={props.handleApprove}
          toggleHelp={props.toggleHelp}
          position={props.position}
          closedText={
            legalData.detailed && legalData.detailed.indexOf(1) > -1
              ? t(`${cardName}.detailedClosedText`)
              : t(`${cardName}.quickItems.${legalData.quick && legalData.quick[0] - 1}`)
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
                <CardQuestion>{t(`${cardName}.detailed`)}</CardQuestion>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KRadio
                  name={'detailed'}
                  label={t(`${cardName}.detailed`)}
                  noLabel
                  itemsName={[0, 1].map((e) => {
                    return t(`${cardName}.detailedItems.${e}`);
                  })}
                  itemsValue={[1, 2]}
                  fieldValue={legalData.detailed}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
            {legalData.detailed && legalData.detailed.indexOf(2) > -1 && (
              <>
                <KFormRow>
                  <KFormCol width={1}>
                    <CardQuestion>{t(`${cardName}.quick`)}</CardQuestion>
                  </KFormCol>
                </KFormRow>
                <KFormRow>
                  <KFormCol width={1}>
                    <KRadio
                      name={'quick'}
                      label={t(`${cardName}.quick`)}
                      noLabel
                      itemsName={[0, 1].map((e) => {
                        return t(`${cardName}.quickItems.${e}`);
                      })}
                      itemsValue={[1, 2]}
                      fieldValue={legalData.quick}
                      setFieldValue={props.setFieldValue}
                    />
                  </KFormCol>
                </KFormRow>
                {legalData.quick && legalData.quick.indexOf(1) > -1 && (
                  <>
                    <KFormRow>
                      <KFormCol width={1}>
                        <CardQuestion>{t(`${cardName}.firstAgeQuestion`)}</CardQuestion>
                      </KFormCol>
                    </KFormRow>
                    <KFormRow>
                      <KFormCol width={1} force={true}>
                        <KNumber
                          name={'firstAge'}
                          label={t(`${cardName}.firstAge`)}
                          fieldValue={legalData.firstAge}
                          setFieldValue={props.setFieldValue}
                        />
                      </KFormCol>
                      {/*<KFormCol width={1}>
                        <KDatePicker
                          name={'quickYear'}
                          label={t(`${cardName}.quickYear`)}
                          format={'YYYY'}
                          fieldValue={legalData.quickYear}
                          setFieldValue={props.setFieldValue}
                        />
                </KFormCol>*/}
                    </KFormRow>
                  </>
                )}
              </>
            )}
            {legalData.detailed && legalData.detailed.indexOf(1) > -1 && (
              <>
                <KFormRow>
                  <KFormCol>
                    <CardQuestion>{t(`${cardName}.selectIkUploadOption`)}</CardQuestion>
                  </KFormCol>
                </KFormRow>
                <OCRProcess
                  t={t}
                  type={legalData.mainType}
                  helpType={legalData.helpType}
                  setIsOpen={() => setIsOpen(true)}
                  scanKey={legalData && legalData.scanKey ? legalData.scanKey : ''}
                  disabled={legalData.isScanReady || (legalData.pkAuszug && legalData.pkAuszug.date)}
                  setFieldValue={(name: string, value: any) => setFieldValue(name, value)}
                  setType={(value: string) => setFieldValue('mainType', value)}
                  setHelpType={(value: string) => setFieldValue('helpType', value)}
                  cardName={cardName}
                  onClose={() => {
                    props.setFieldValue('detailed', []);
                    initDocScan();
                  }}
                  isOpen={isOpen}
                  isAwaiting={isAwaiting}
                  onRescan={onRescan}
                />
                {((legalData.isScanReady && legalData.pkAuszug) || legalData.mainType === 'edit') && (
                  <PkScanResultComponent
                    t={t}
                    cardName={cardName}
                    state={legalData.pkAuszug ? legalData.pkAuszug : ({} as PkScanResult)}
                    setFieldValue={updateScanResult}
                    setFieldValues={updateScanResults}
                    addItemToList={addItemToList}
                    removeFromList={removeItemFromList}
                  />
                )}
              </>
            )}
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
      {legalData && !legalData.isScanReady && isOpen && (
        <PkAuszugResults
          onCancel={() => {
            initDocScan();
            setIsOpen(false);
            props.setFieldValue('detailed', []);
          }}
          getData={() => succesScanCallback(legalData && legalData.scanKey ? legalData.scanKey : '')}
          onSave={confirmData}
          personData={person && person.gender && person.gender.length > 0 ? { gender: person.gender[0] } : undefined}
        />
      )}
    </>
  );
};
