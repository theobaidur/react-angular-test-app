import React, { useEffect, useState, useRef, useCallback } from 'react';

import { KFormCard, KRadio, KNumber, KDatePicker } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props } from './../../module.interfaces';
import { constantNumbers } from '../../../utils/calculators';
import { Icon, IconButtonWithText, CounterLabel, CardHeading, CardQuestion } from '../../../components/common/styled';
import { httpActions, documentTypes } from '../../../constants/enums';
import { IkSummaryItem } from "../IkSummaryItem";
import showNum from '../../../utils/showNum';
import { OCRProcess } from '../../../components/common/ocrProcess';
import { IKAuszugComponent } from '../../../components/common/ikAuszug';
import { config } from '../../../config';
import authService from '../../../services/authService';
import SimpleValidator from '../../../utils/validator';
import scanProvider from '../../../providers/scanProvider';
import { useMemoizedCallback } from '../../../utils/customCallbackHook';
import useCardValidation from '../../../utils/useCardValidation';
import useEffectOnlyOnce from '../../../utils/useEffectOnlyOnce';

// @ts-ignore
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { IkSummaryRow_Props } from './IkSummaryRow_Props';
import { IkSummaryRow } from './ikSummaryRow';

export const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const EventSourceWrapper = NativeEventSource ? NativeEventSource : EventSourcePolyfill;

  const { legalData, cardName, t, setFieldValue, setFieldValues } = props;
  const [response, setResponse] = useState<any>();
  const [evtSource, setEvtSource] = useState<EventSource>();
  const [validator] = useState<SimpleValidator>(new SimpleValidator());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAwaiting, setIsAwaiting] = useState<boolean>(false);

  const legalDataScanKey = legalData && legalData.scanKey;

  const initDocScan = useCallback(() => {
    scanProvider.initDocScan(
      documentTypes.IK,
      (res) => {
        setFieldValue('scanKey', res.code);
      },
      (err) => console.error(err)
    );
  }, [setFieldValue]);

  useEffectOnlyOnce(() => initDocScan());

  const succesScanCallback = useMemoizedCallback(() => {
    if (legalData && legalData.scanKey) {
      scanProvider.getDocScanResult(
        legalData.scanKey,
        (res: any) => {
          setResponse(res);
          setFieldValue('isScanReady', true);
        },
        (err: string) => console.error(err)
      );
    }
  }, [legalData, setFieldValue]);

  useEffect(() => {
    if (legalDataScanKey) {
      const source = new EventSourceWrapper(
        `${config.monetoApiUrl}?action=${
          httpActions.AWAIT_DOCSCAN_RESULT
        }&key=${legalDataScanKey}&session=${authService.getSessionFromStorage()}`
      );
      source.onmessage = (event: any) => {
        if (event.data === 'done') {
          source.close();
          succesScanCallback();
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
  }, [succesScanCallback, legalDataScanKey, EventSourceWrapper]);

  useEffect(() => {
    if (evtSource) {
      return () => {
        if (evtSource) evtSource.close();
      };
    }
  }, [evtSource]);

  useCardValidation(props);

  const addItemToIKList = () => {
    let name = 'ikSummaryItems';
    let updatedList: Array<IkSummaryItem> =
      legalData && Array.isArray(legalData[name])
        ? legalData[name].concat({
            year: legalData[name].length > 0 ? String(Number(legalData[name][legalData[name].length - 1].year) + 1) : ''
          } as IkSummaryItem)
        : [{} as IkSummaryItem];
    setFieldValue(name, updatedList);
  };

  const removeItemFromList = useMemoizedCallback(
    (name: string, index: number, pageIndex?: number) => {
      let updatedList: Array<IkSummaryItem> = legalData && legalData[name];
      updatedList.splice(index, 1);
      setFieldValue(name, updatedList);
    },
    [legalData]
  );

  const updateListItem = useMemoizedCallback(
    (name: string, value: any) => {
      const locations: Array<string> = name.split('.');
      let updatedList: Array<IkSummaryItem> =
        legalData && Array.isArray(legalData[locations[0]]) ? legalData[locations[0]] : [];

      updatedList[Number(locations[1])] = {
        ...updatedList[Number(locations[1])],
        [locations[2]]: value
      };
      setFieldValue(locations[0], updatedList);
    },
    [legalData, setFieldValue]
  );

  const renderIkSummaryRow = (item: IkSummaryItem, index: number) => {
    return (
      <IkSummaryRow
        key={index}
        item={item}
        index={index}
        validator={validator}
        t={t}
        removeItemFromList={removeItemFromList}
        updateListItem={updateListItem}
        cardName={cardName}
      />
    );
  };
  const onRescan = () => {
    initDocScan();
    setFieldValues([
      {
        name: 'ikSummaryItems',
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
    setResponse(undefined);
    setIsOpen(false);
  };

  const kFormRef = useRef<any>();
  return (
    <>
      {legalData ? (
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
            {legalData.detailed && legalData.detailed.indexOf(2) > -1 ? (
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

                {legalData.quick ? (
                  <>
                    {legalData.quick.indexOf(1) > -1 ? (
                      <>
                        <KFormRow>
                          <KFormCol width={1}>
                            <CardQuestion>{t(`${cardName}.firstAgeQuestion`)}</CardQuestion>
                          </KFormCol>
                          <KFormCol width={1} force={true}>
                            <KNumber
                              name={'firstAge'}
                              label={t(`${cardName}.firstAge`)}
                              fieldValue={legalData.firstAge}
                              setFieldValue={props.setFieldValue}
                            />
                          </KFormCol>
                        </KFormRow>

                        <KFormRow>
                          <KFormCol width={1}>
                            <CardQuestion>{
                            t(`${cardName}.missing`,
                            { missingFrom:
                              (legalData.firstAge ?
                              t(`${cardName}.missingFrom`, { age: legalData.firstAge }) :
                              '')  })}
                            </CardQuestion>
                          </KFormCol>
                          <KFormCol width={1} force={true}>
                            <KRadio
                              name={'missing'}
                              label={''}
                              noLabel
                              itemsName={[0, 1].map((e) => {
                                return t(`${cardName}.missingItems.${e}`);
                              })}
                              itemsValue={[1, 2]}
                              fieldValue={legalData.missing}
                              setFieldValue={props.setFieldValue}
                            />
                          </KFormCol>
                          {legalData.missing && legalData.missing.indexOf(1) > -1 ? (
                            <KFormCol width={1 / 2} force={true}>
                              <KNumber
                                name={'missingYears'}
                                label={t(`${cardName}.missingYears`)}
                                fieldValue={legalData.missingYears}
                                setFieldValue={props.setFieldValue}
                              />
                            </KFormCol>
                          ) : (
                            ''
                          )}
                        </KFormRow>
                      </>
                    ) : (
                      ''
                    )}
                    {legalData.quick.indexOf(2) > -1 ? (
                      <>
                        <KFormRow>
                          <KFormCol width={1}>
                            <CardQuestion>{t(`${cardName}.minMedMax`)}</CardQuestion>
                          </KFormCol>
                        </KFormRow>
                        <KFormRow>
                          <KFormCol width={1}>
                            <KRadio
                              name={'minMedMax'}
                              label={t(`${cardName}.minMedMax`)}
                              noLabel
                              itemsName={[0, 1, 2].map((e) => {
                                return t(`${cardName}.minMedMaxItems.${e}`, {
                                  value: showNum(constantNumbers.AHV_minMedMax(e + 1))
                                });
                              })}
                              itemsValue={[1, 2, 3]}
                              fieldValue={legalData.minMedMax}
                              setFieldValue={props.setFieldValue}
                            />
                          </KFormCol>
                        </KFormRow>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  ''
                )}
              </>
            ) : (
              legalData.detailed &&
              legalData.detailed.indexOf(1) > -1 && (
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
                    templateName="IK"
                    scanKey={legalData && legalData.scanKey ? legalData.scanKey : ''}
                    disabled={
                      legalData.isScanReady || (legalData.ikSummaryItems && legalData.ikSummaryItems.length > 0)
                    }
                    setFieldValue={(name: string, value: any) => setFieldValue(name, value)}
                    setType={(value: string) => setFieldValue('mainType', value)}
                    setHelpType={(value: string) => setFieldValue('helpType', value)}
                    cardName={cardName}
                    setIsOpen={() => setIsOpen(true)}
                    onClose={() => {
                      setFieldValues([
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
                    }}
                    isOpen={isOpen}
                    isAwaiting={isAwaiting}
                    onRescan={onRescan}
                  />
                  {(legalData.isScanReady || legalData.mainType === 'edit') &&
                    legalData.ikSummaryItems &&
                    legalData.ikSummaryItems.length > 0 &&
                    legalData.ikSummaryItems.map(renderIkSummaryRow)}
                  {(legalData.isScanReady || legalData.mainType === 'edit') && (
                    <KFormRow>
                      <KFormCol width={1}>
                        <IconButtonWithText type="button" onClick={addItemToIKList}>
                          <i />
                          {t(`${cardName}.addLine`)}
                        </IconButtonWithText>
                      </KFormCol>
                    </KFormRow>
                  )}
                </>
              )
            )}
          </KFormSection>
        </KFormCard>
      ) : (
        ''
      )}
      {legalData && isOpen && (
        <IKAuszugComponent
          response={response}
          onCancel={() => {
            setFieldValues([
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
            setResponse(undefined);
            setIsOpen(false);
          }}
          acceptData={(value: Array<IkSummaryItem>) => {
            initDocScan();
            value.sort((a, b) => {
              let yearA = parseInt(a.year);
              if (yearA < 1000) {
                if (yearA < 30) {
                  yearA += 2000;
                } else {
                  yearA += 1900;
                }
              }

              let yearB = parseInt(b.year);
              if (yearB < 1000) {
                if (yearB < 30) {
                  yearB += 2000;
                } else {
                  yearB += 1900;
                }
              }

              if (yearA > yearB) {
                return 1;
              } else if (yearA < yearB) {
                return -1;
              } else {
                return 0;
              }
            });

            setFieldValue('ikSummaryItems', value);
            setIsOpen(false);
            setResponse(undefined);
            if (kFormRef && kFormRef.current && kFormRef.current.handleApprove) kFormRef.current.handleApprove(true);
          }}
        />
      )}
    </>
  );
};


