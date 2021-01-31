import React, { useEffect, useState, useCallback } from 'react';

import { Content, BorderLabel, IconButtonWithText } from '../../../components/common/styled';
import { ikStaticTable, ikSystemNames } from '../../../constants/enums';

import { HighlightProps } from '../../../components/common/pkAuszug/pkAuszug.interfaces';
import { getBoundaries } from '../../../utils/scanResult';
import { PortalScanVerification } from '../../../components/common/portalScanVerification';
import {
  IkScanResultItem,
  IkScanResultItemValue,
  IkSummaryItem
} from '../../../app_modules/pensionState/modulePensionState';
import { IkSummaryRow } from '../../../app_modules/pensionState/cards/cardPensionState';
import { useTranslation } from 'react-i18next';
import Validator from '../../../utils/validator';
import { default as deepDiff } from 'deep-diff';
import { DummyProgressPopup } from '../uploadFiles/components/progressPopup.component';
import scanProvider from '../../../providers/scanProvider';
import { useMemoizedCallback } from '../../../utils/customCallbackHook';
import { DetectionSummary } from './components/ocrDetectionSummary.component';
import { KFormRow, KFormCol } from '../../KForm/KForm_styles';
import { KNumber } from '../../KForm';

interface IKAuszugComponent_Props {
  response: any;
  getData?: any;
  onCancel?: (x: any) => void | undefined;
  onBackToScan?: (x: any) => void | undefined;
  cardName?: string | undefined;
  acceptData: (x: Array<IkSummaryItem>) => void;
  onSave?: (res: any) => void;
}

const useInitialDocScansData = (getData: Function) => {
  const initialResultsData = { data: '', images: [], code: '' };
  const [data, setData] = useState(initialResultsData);
  useEffect(() => {
    async function asyGetData() {
      const initialData = getData ? await getData() : { data: undefined };
      setData(initialData);
    }
    asyGetData();
  }, [getData]);
  return data;
};

export const IKAuszugComponent: React.FC<IKAuszugComponent_Props> = ({
  response,
  onCancel,
  onBackToScan,
  acceptData,
  cardName = 'results',
  getData,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { t } = useTranslation('ikScan');
  const [listWithVertex, setListWithVertex] = useState<Array<IkScanResultItem>>([]);
  const [current, setCurrent] = useState<number>(0);
  const [images, setImages] = useState<Array<string>>([]);
  const [total, setTotal] = useState(0);
  const [detectionSummary, setDetectionSummary] = useState<DetectionSummary>();
  const [initialState, setInitialState] = useState<Array<Array<IkSummaryItem>>>([]);

  const [photoData, setPhotoData] = useState<Array<Array<IkSummaryItem>>>([]);
  const [validator] = useState<Validator>(
    new Validator({
      validators: {
        should_match_total: {
          message: t(`${cardName}.matchTotalValidation`),
          rule: (val: any, params: Array<any>) => params.indexOf(val.toString()) > -1,
          required: true
        }
      }
    })
  );

  const docScans = useInitialDocScansData(getData);
  const [allowAccept, setAllowAccept] = useState<boolean>(false);

  validator.onValidationResult = setAllowAccept;

  const updateDocScan = useCallback(
    (fd: FormData, saveCallback?: Function) => {
      fd.append('status', '2');
      fd.append('key', response ? docScans.code || response.code : docScans.code);
      fd.append('action', 'updateDocScan');
      scanProvider.updateDocScan(
        fd,
        (res: any) => {
          if (saveCallback) {
            saveCallback(res);
          }
        },
        (err) => console.log(err)
      );
    },
    [docScans.code, response]
  );

  const saveInitialScanResults = useCallback(
    (scanResultsState: any) => {
      const updateScanFD = new FormData();
      setInitialState(scanResultsState);
      updateScanFD.append('scan_result_initial', JSON.stringify(scanResultsState));
      updateDocScan(updateScanFD);
    },
    [updateDocScan]
  );

  const parseResponse = useCallback(
    (evt: Array<IkScanResultItem>) => {
      try {
        // Trying to get document issue date
        let issueDate: any = evt
          .filter((item: IkScanResultItem) => item.SystemName === ikSystemNames.DATE_OF_ISSUE)[0]
          .Values[0].Value.trim();
        issueDate = parseInt(issueDate.substring(issueDate.length - 4));
        let currentYear: number = new Date().getFullYear();
        if (currentYear - issueDate > 0 && issueDate > currentYear - 50 && issueDate < currentYear + 50) {
          alert(t('expiredTemplateMessage'));
        }
      } catch (ex) {
        // Failed to get document issue date.
      }

      try {
        // Trying to get total
        let total: any = evt
          .filter((item: IkScanResultItem) => item.SystemName === ikSystemNames.TOTAL)[0]
          .Values[0].Value.trim();
        total = parseInt(total);
        setTotal(total);
      } catch (ex) {
        setTotal(0);
      }

      let filteredIkStaticTableItems: Array<IkScanResultItem> = evt.filter(
        (item: IkScanResultItem) => item.SystemName === ikSystemNames.IK_STATIC_TABLE
      );
      let data: Array<Array<IkSummaryItem>> = [[]];

      filteredIkStaticTableItems.forEach((item: IkScanResultItem) => {
        let obj: IkSummaryItem = {} as IkSummaryItem;
        item.Values.forEach((x: IkScanResultItemValue) => {
          if (x.SystemName === ikStaticTable.INCOME_CODE) {
            obj.incomeCode = Number(x.Value) ? Number(x.Value) : 1;
            obj.isCodeValid = Number(x.Value) ? true : false;
          } else if (x.SystemName === ikStaticTable.YEAR) obj.year = x.Value;
          else if (x.SystemName === ikStaticTable.INCOME) obj.income = Number(x.Value);
        });

        if (!data[item.PageIndex]) {
          data[item.PageIndex] = [];
        }

        data[item.PageIndex].push(obj);
      });

      setPhotoData(data);
      setListWithVertex(filteredIkStaticTableItems);
      saveInitialScanResults(data);
      validator.messagesShown = true;
      validator.forceUpdate();
    },
    [saveInitialScanResults, t, validator]
  );

  useEffect(() => {
    if (response) {
      let res: any = JSON.parse(response.data).listWithVertex;
      parseResponse(typeof res === 'string' ? JSON.parse(res).ProcessedKeys : res.ProcessedKeys);
      setImages(response.images);
      setDetectionSummary(JSON.parse(JSON.parse(response.data).DetectionSummary));
    }
  }, [response, parseResponse, docScans]);

  useEffect(() => {
    if (docScans && docScans.data) {
      let res: any = JSON.parse(docScans.data).listWithVertex;
      parseResponse(typeof res === 'string' ? JSON.parse(res).ProcessedKeys : res.ProcessedKeys);
      setImages(docScans.images);
      setDetectionSummary(JSON.parse(JSON.parse(docScans.data).DetectionSummary));
    }
  }, [docScans.data, docScans, parseResponse]);

  const saveFinalScanResults = (scanResultsState: any, saveCallback: Function) => {
    const updateScanFD = new FormData();
    updateScanFD.append('scan_result_final', JSON.stringify(scanResultsState));
    updateDocScan(updateScanFD, saveCallback);
  };

  const isDifferent = () => {
    const maxDifference = 0.1; // 10%

    let emptyData = [
      (initialState || []).map((m) => {
        return [];
      })
    ];
    const differ: number = (deepDiff.diff(initialState, photoData) || []).length;
    const totalLength: number = (deepDiff.diff(initialState, emptyData) || []).length;
    console.log('User edited ' + parseInt((differ / totalLength) * 100 + '') + '% of form fields');
    return differ / totalLength > maxDifference;
  };

  const removeItemFromList = useMemoizedCallback(
    (name: string, index: number, pageIndex?: number) => {
      let currentIndex = pageIndex !== undefined ? pageIndex : current;
      let updatedList: Array<IkSummaryItem> = [...photoData[currentIndex]];
      updatedList.splice(index, 1);
      let filteredList = listWithVertex.filter((item: IkScanResultItem) => item.PageIndex === currentIndex);
      let generalIndex = listWithVertex.indexOf(filteredList[index]);
      setListWithVertex(listWithVertex.slice(0, generalIndex).concat(listWithVertex.slice(generalIndex + 1)));
      setPhotoData(
        photoData.map((itemArray: IkSummaryItem[], indexArray: number) => {
          if (indexArray === currentIndex) {
            return updatedList;
          } else {
            return itemArray;
          }
        })
      );
      if (validator) {
        validator.purgeFields();
        validator.messagesShown = true;
        validator.forceUpdate();
      }
    },
    [current, listWithVertex, setListWithVertex, photoData, validator]
  );

  const addItemToList = useMemoizedCallback(
    (name: string, pageIndex?: number) => {
      let currentIndex = pageIndex !== undefined ? pageIndex : current;
      let updatedList: Array<IkSummaryItem> = [...photoData[currentIndex]];

      updatedList.push({} as IkSummaryItem);

      let filteredList = listWithVertex.filter((item: IkScanResultItem) => item.PageIndex === currentIndex);
      let generalIndex =
        listWithVertex.indexOf(filteredList[filteredList.length > 0 ? filteredList.length - 1 : 0]) + 1;

      listWithVertex.splice(generalIndex, 0, {
        PageIndex: pageIndex,
        KeyValue: '',
        KeyType: '',
        SystemName: '',
        boundingPoly: undefined as any,
        combinedBoundingPoly: { verticles: [] } as any,
        Values: []
      } as IkScanResultItem);
      setListWithVertex(listWithVertex);

      setPhotoData(
        photoData.map((itemArray: IkSummaryItem[], indexArray: number) => {
          if (indexArray === currentIndex) {
            return updatedList;
          } else {
            return itemArray;
          }
        })
      );
      if (validator) {
        validator.purgeFields();
        validator.messagesShown = true;
        validator.forceUpdate();
      }
    },
    [current, listWithVertex, setListWithVertex, photoData, validator]
  );

  const updateListItem = useCallback(
    (name: string, value: any) => {
      const locations: Array<string> = name.split('.');
      setPhotoData((photoDataIn) =>
        photoDataIn.map((itemArray: IkSummaryItem[], indexArray: number) => {
          if (indexArray === current) {
            return itemArray.map((item: IkSummaryItem, index: number) => {
              if (index === Number(locations[1])) {
                return { ...item, [locations[2]]: value };
              } else {
                return item;
              }
            });
          } else {
            return itemArray;
          }
        })
      );
    },
    [current]
  );

  const finish = () => {
    let resultedArray: any = [];
    if (validator === undefined || validator.allValid()) {
      photoData.map((item: any) => (resultedArray = resultedArray.concat(item)));
      setIsOpen(false);
      saveFinalScanResults(photoData, (saveResult: any) => {
        if (onSave) {
          onSave(resultedArray);
        }
        if (acceptData) {
          acceptData(resultedArray);
        }
      });
    }
  };

  return images && images.length > 0 ? (
    <PortalScanVerification
      t={t}
      cardName={cardName}
      onCancel={onCancel}
      onBackToScan={onBackToScan}
      renderContent={(x: Function) => (
        <RenderContent
          photoData={photoData}
          listWithVertex={listWithVertex}
          t={t}
          cardName={cardName}
          current={current}
          setCurrent={setCurrent}
          setBoundaryPoly={x}
          removeItemFromList={removeItemFromList}
          addItemToList={addItemToList}
          updateListItem={updateListItem}
          validator={validator}
          total={total}
          setTotal={setTotal}
        />
      )}
      images={images}
      isOpen={isOpen}
      finish={finish}
      current={current}
      setCurrent={setCurrent}
      allowAccept={allowAccept}
      updateDocScan={updateDocScan}
      isDifferent={isDifferent}
      detectionSummary={detectionSummary}
    />
  ) : (
    <DummyProgressPopup templateName="IK" />
  );
};

const RenderContent: React.FC<any> = ({
  photoData,
  listWithVertex,
  t,
  cardName,
  current,
  setCurrent,
  setBoundaryPoly,
  removeItemFromList,
  addItemToList,
  updateListItem,
  validator,
  total,
  setTotal
}) => {
  const onClick = useMemoizedCallback(
    (name: string, index: number) => {
      let names: Array<string> = name.split('.');
      if (names[2] === 'incomeCode') names[2] = 'income_code';
      let res: HighlightProps | undefined = getBoundaries(
        listWithVertex.filter((item: IkScanResultItem) => item.PageIndex === index)[Number(names[1])],
        names[2].toUpperCase()
      );
      if (res !== undefined) {
        setBoundaryPoly(res);
      }

      if (index !== current) setCurrent(index);
    },
    [current, setCurrent, listWithVertex, setBoundaryPoly]
  );

  const calculateTotal = () => {
    let totalCalculated = 0;
    photoData.forEach((page: any) => {
      page &&
        page.forEach((row: any) => {
          if (row && !isNaN(row.income)) {
            totalCalculated += row.income;
          }
        });
    });
    return totalCalculated;
  };

  return (
    <>
      {photoData &&
        photoData.map((data: any, index: number) => (
          <RenderContentInternal
            key={index}
            t={t}
            cardName={cardName}
            removeItemFromList={removeItemFromList}
            addItemToList={addItemToList}
            updateListItem={updateListItem}
            onClickListItem={onClick}
            validator={validator}
            data={data}
            pageIndex={index}
          ></RenderContentInternal>
        ))}
      {photoData && (
        <Content>
          <BorderLabel>{t(`${cardName}.total`)}</BorderLabel>
          <KFormRow>
            <KFormCol width={1 / 2}>
              <KNumber
                name={`ikSummaryItems.totalScanned`}
                label={t(`${cardName}.totalScanned`)}
                fieldValue={total}
                setFieldValue={(name: string, value: any) => setTotal(value)}
                validator={validator}
                validations={`required|should_match_total:${calculateTotal()}`}
              />
            </KFormCol>
            <KFormCol width={1 / 2}>
              <KNumber
                name={`ikSummaryItems.totalCalculated`}
                label={t(`${cardName}.totalCalculated`)}
                fieldValue={calculateTotal()}
                readonly
              />
            </KFormCol>
          </KFormRow>
        </Content>
      )}
    </>
  );
};

const RenderContentInternal: React.FC<any> = ({
  t,
  cardName,
  removeItemFromList,
  addItemToList,
  updateListItem,
  onClickListItem,
  validator,
  data,
  pageIndex
}) => {
  const onClickInternal = useCallback(
    (name: string) => {
      onClickListItem(name, pageIndex);
    },
    [onClickListItem, pageIndex]
  );
  const addItemToListClick = () => {
    addItemToList('ikSummaryItems', pageIndex);
  };
  return data && data.length > 0 ? (
    <Content>
      <BorderLabel>
        {t([`${cardName}.contentLabels.${pageIndex}`, `${cardName}.contentLabelsDefault`], {
          value: pageIndex + 1
        })}
      </BorderLabel>
      {data &&
        data.length > 0 &&
        data.map((item: IkSummaryItem, helpIndex: number) => (
          <IkSummaryRow
            key={helpIndex}
            item={item}
            index={helpIndex}
            pageIndex={pageIndex}
            isIncomeCodeVisible
            onClick={onClickInternal}
            t={t}
            removeItemFromList={removeItemFromList}
            updateListItem={updateListItem}
            cardName={cardName}
            validator={validator}
          />
        ))}
      <KFormRow>
        <KFormCol width={1}>
          <IconButtonWithText type="button" onClick={addItemToListClick}>
            <i />
            {t(`${cardName}.addLine`)}
          </IconButtonWithText>
        </KFormCol>
      </KFormRow>
    </Content>
  ) : null;
};
