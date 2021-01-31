import React, { useState, useEffect, useCallback } from 'react';

import { pkStaticName, pkStaticValueKeys } from '../../../constants/enums';
import { IkScanResultItem } from "../../../app_modules/pensionState/IkScanResultItem";
import { IkScanResultItemValue } from "../../../app_modules/pensionState/IkScanResultItemValue";
import {
  PkScanResult,
  DeathBenefitArrayItem,
  DisibilityPensionArrayItem,
  RetirementBenefitItem
} from './pkAuszug.interfaces';
import { PersonalData } from './components/personalData.component';
import { SalaryData } from './components/salaryData.component';
import { PensionActivesData } from './components/pensionActivesData.component';
import { OwnershipWithdrawData } from './components/ownershipWithdrawData.component';
import { RetirementBenefits } from './components/retirementBenefits.component';
import { DisabilityPension } from './components/disabilityPension.component';
import { DeathBenefit } from './components/deathBenefit.component';
import { SurvivorsProtection } from './components/survivorsProtection.component';
import { getBoundaries } from '../../../utils/scanResult';
import { PortalScanVerification } from '../portalScanVerification';
import { useTranslation } from 'react-i18next';
import Validator from '../../../utils/validator';
import { default as deepDiff } from 'deep-diff';
import { DummyProgressPopup } from '../uploadFiles/components/progressPopup.component';
import scanProvider from '../../../providers/scanProvider';
import { DetectionSummary } from '../ikAuszug/components/ocrDetectionSummary.component';
import { FieldValuePair } from '../../../app_modules/module.interfaces';

interface PKAuszugResultProps {
  key?: string;
  getData: Function;
  onCancel?: (x: any) => void | undefined;
  onBackToScan?: (x: any) => void | undefined;
  cardName?: string | undefined;
  onSave: (res: PkScanResult) => void;
  personData?: PersonData;
}

interface PersonData {
  gender: Number | undefined;
}

const useInitialDocScansData = (getData: Function) => {
  const initialResultsData = { data: '', images: [], code: '' };
  const [data, setData] = useState(initialResultsData);
  useEffect(() => {
    async function asyGetData() {
      const initialData = await getData();
      setData(initialData);
    }
    asyGetData();
  }, [getData]);
  return data;
};

const isInitialData = (docScanData: any) => {
  return (
    docScanData &&
    docScanData.data === '' &&
    docScanData.code === '' &&
    Array.isArray(docScanData.images) &&
    docScanData.images.length === 0
  );
};

export const PkAuszugResults: React.FC<PKAuszugResultProps> = ({
  onCancel,
  onBackToScan,
  getData,
  cardName = 'results',
  onSave,
  personData
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [state, setState] = useState<PkScanResult>({} as PkScanResult);
  const [initialState, setInitialState] = useState<PkScanResult>({} as PkScanResult);
  const [current, setCurrent] = useState<number>(0);
  const [response, setResponse] = useState<Array<IkScanResultItem>>([]);
  const [images, setImages] = useState<Array<string>>([]);
  const [detectionSummary, setDetectionSummary] = useState<DetectionSummary>();
  const { t } = useTranslation('pkScan');
  const docScans = useInitialDocScansData(getData);
  const [validator] = useState<Validator>(new Validator());
  const [allowAccept, setAllowAccept] = useState<boolean>(false);

  validator.onValidationResult = setAllowAccept;

  const finish = () => {
    if (validator === undefined || validator.allValid()) {
      setIsOpen(false);
      saveFinalScanResults(state, (saveResult: any) => {
        onSave(state);
      });
    }
  };

  useEffect(() => {
    if (docScans && docScans.data) {
      let res = JSON.parse(docScans.data);
      if (res.listWithVertex) setResponse(JSON.parse(res.listWithVertex).ProcessedKeys);
      if (res.DetectionSummary) setDetectionSummary(JSON.parse(res.DetectionSummary));

      if (res.Images) {
        setImages((JSON.parse(res.Images) as Array<string>).map((item: string) => `data:image/jpeg;base64,${item}`));
      } else if (docScans.images) {
        setImages(docScans.images);
      }
    }
  }, [docScans, docScans.data]);

  const updateDocScan = useCallback(
    (fd: FormData, saveCallback?: Function) => {
      fd.append('status', '2');
      fd.append('key', docScans.code);
      fd.append('action', 'updateDocScan');
      scanProvider.updateDocScan(
        fd,
        (res: any) => {
          if (saveCallback) {
            saveCallback(res);
          }
        },
        (err: any) => console.log(err)
      );
    },
    [docScans.code]
  );

  const saveInitialScanResults = useCallback(
    (scanResultsState: any) => {
      setInitialState(scanResultsState);
      const updateScanFD = new FormData();
      updateScanFD.append('scan_result_initial', JSON.stringify(scanResultsState));
      updateDocScan(updateScanFD);
    },
    [updateDocScan]
  );

  const saveFinalScanResults = (scanResultsState: any, saveCallback: Function) => {
    const updateScanFD = new FormData();
    updateScanFD.append('scan_result_final', JSON.stringify(scanResultsState));
    updateDocScan(updateScanFD, saveCallback);
  };

  const isDifferent = () => {
    const maxDifference = 0.1; // 10%
    const differ: number = (deepDiff.diff(initialState, state) || []).length;
    const totalLength: number = (deepDiff.diff(initialState, {}) || []).length;
    console.log('User edited ' + parseInt((differ / totalLength) * 100 + '') + '% of form fields');
    return differ / totalLength > maxDifference;
  };

  const getField = useCallback(
    (name: string, type: string = 'value') => {
      let resField: any = {
        ResponseItem: undefined,
        Name: name,
        Value: undefined
      };

      const names: Array<string> = name.split('.');

      if (type === 'array' && names.length === 2) {
        let res: Array<IkScanResultItem> | undefined = response.filter(
          (item: IkScanResultItem) =>
            item.SystemName === names[0] &&
            (!names[1] || item.Values.find((val: IkScanResultItemValue) => val.SystemName === names[1]))
        );
        return res;
      } else if (name === 'company' && docScans.data) {
        const data = JSON.parse(docScans.data);
        resField.Value = data && data.CompanyName ? data.CompanyName : '';
        return resField;
      } else if (names.length === 3) {
        let res: Array<IkScanResultItem> | undefined = response.filter(
          (item: IkScanResultItem) => item.SystemName === names[0]
        );
        if (res && res.length - 1 >= Number(names[1])) {
          let newRes: IkScanResultItemValue | undefined = res[Number(names[1])].Values.find(
            (item: IkScanResultItemValue) => item.SystemName === names[2]
          );
          if (newRes) {
            resField.ResponseItem = res[Number(names[1])];
            resField.Value = newRes.Value;
            return resField;
          }
        }
      } else if (names.length === 2) {
        let res: Array<IkScanResultItem> = response.filter((item: IkScanResultItem) => item.SystemName === names[0]);
        if (res && res.length > 0) {
          for (let item in res) {
            let newRes: IkScanResultItemValue | undefined = res[Number(item)].Values.find(
              (item: IkScanResultItemValue) => item.SystemName === names[1]
            );
            if (newRes && newRes.Value) {
              resField.ResponseItem = res[Number(item)];
              resField.Value = newRes.Value;
              return resField;
            }
          }
        }
      }
      return resField;
    },
    [docScans.data, response]
  );

  const getTableFieldsCount = useCallback(
    (name: string) => {
      return response.filter(
        (item: IkScanResultItem) => item.SystemName === name && (item.KeyType || '').endsWith('Table')
      ).length;
    },
    [response]
  );

  const getFieldsCount = useCallback(
    (name: string) => {
      return response.filter((item: IkScanResultItem) => item.SystemName === name).length;
    },
    [response]
  );

  const getFieldValue = useCallback(
    (name: string, type: string = 'value') => {
      const names: Array<string> = name.split('.');

      if (type === 'array' && names.length === 2) {
        let res: Array<IkScanResultItem> | undefined = response.filter(
          (item: IkScanResultItem) =>
            item.SystemName === names[0] &&
            (!names[1] || item.Values.find((val: IkScanResultItemValue) => val.SystemName === names[1]))
        );
        return res;
      } else if (name === 'company' && docScans.data) {
        const data = JSON.parse(docScans.data);
        return data && data.CompanyName ? data.CompanyName : '';
      } else if (names.length === 3) {
        let res: Array<IkScanResultItem> | undefined = response.filter(
          (item: IkScanResultItem) => item.SystemName === names[0] // && (item.KeyType || '').endsWith('Table')
        );
        if (res && res.length - 1 >= Number(names[1])) {
          let newRes: IkScanResultItemValue | undefined = res[Number(names[1])].Values.find(
            (item: IkScanResultItemValue) => item.SystemName === names[2]
          );
          if (newRes) {
            return newRes.Value;
          }
        }
      } else if (names.length === 2) {
        let res: Array<IkScanResultItem> = response.filter((item: IkScanResultItem) => item.SystemName === names[0]);
        if (res && res.length > 0) {
          for (let item in res) {
            let newRes: IkScanResultItemValue | undefined = res[Number(item)].Values.find(
              (item: IkScanResultItemValue) => item.SystemName === names[1]
            );
            if (newRes && newRes.Value) {
              return newRes.Value;
            }
          }
        }
      }
      return undefined;
    },
    [docScans.data, response]
  );

  const getDeathBenefitItems = useCallback(() => {
    const count: number = getFieldsCount(pkStaticName.DEATH_CAPITAL);
    let result: Array<DeathBenefitArrayItem> = [];
    for (let index = 0; index < count; index++) {
      let isMapped: boolean = false;
      let deathCapitalPrefix = count === 1 ? `${pkStaticName.DEATH_CAPITAL}` : `${pkStaticName.DEATH_CAPITAL}.${index}`;

      let obj: DeathBenefitArrayItem = {
        deathcapital: 0,
        deathaccident: [],
        deathillness: [],
        deathmarried: [],
        deathnotmarried: [],
        vertexes: {}
      } as DeathBenefitArrayItem;

      obj.vertexes.deathcapital = getField(`${deathCapitalPrefix}.${pkStaticValueKeys.TOTAL}`);
      obj.deathcapital = obj.vertexes.deathcapital.Value;
      if (obj.deathcapital && Number(obj.deathcapital) !== 0) {
        obj.deathaccident = [];
        obj.deathillness = [];
        result.push(JSON.parse(JSON.stringify(obj)));
        isMapped = true;
      }

      obj.vertexes.deathcapital = getField(`${deathCapitalPrefix}.${pkStaticValueKeys.ILLNESS}`);
      obj.deathcapital = obj.vertexes.deathcapital.Value;
      if (obj.deathcapital && Number(obj.deathcapital) !== 0) {
        obj.deathaccident = [];
        obj.deathillness = [1];
        result.push(JSON.parse(JSON.stringify(obj)));
        isMapped = true;
      }

      obj.vertexes.deathcapital = getField(`${deathCapitalPrefix}.${pkStaticValueKeys.ACCIDENT}`);
      obj.deathcapital = obj.vertexes.deathcapital.Value;
      if (obj.deathcapital && Number(obj.deathcapital) !== 0) {
        obj.deathaccident = [1];
        obj.deathillness = [];
        result.push(JSON.parse(JSON.stringify(obj)));
        isMapped = true;
      }

      if (!isMapped) {
        obj.vertexes.deathcapital = firstNonZeroField(
          getField(`${deathCapitalPrefix}.${pkStaticValueKeys.TOTAL}`),
          getField(`${deathCapitalPrefix}.${pkStaticValueKeys.ILLNESS}`),
          getField(`${deathCapitalPrefix}.${pkStaticValueKeys.ACCIDENT}`)
        );
        obj.deathcapital = obj.vertexes.deathcapital.Value;
        obj.deathaccident = [];
        obj.deathillness = [];
        result.push(obj);
      }
    }
    return result;
  }, [getField, getFieldsCount]);

  const getDisabilityPensionItems = useCallback(() => {
    const count: number = getFieldsCount(pkStaticName.DIS_RENT);

    let result: Array<DisibilityPensionArrayItem> = [];
    for (let index = 0; index < count; index++) {
      let obj: DisibilityPensionArrayItem = {
        vertexes: {}
      } as DisibilityPensionArrayItem;

      obj.vertexes.disvalue = firstNonZeroField(
        getField(`${pkStaticName.DIS_RENT}.${index}.${pkStaticValueKeys.ANNUAL_TOTAL}`),
        getField(`${pkStaticName.DIS_RENT}.${index}.${pkStaticValueKeys.ANNUAL_ILLNESS}`)
      );
      obj.disvalue = obj.vertexes.disvalue.Value;

      obj.vertexes.diswait = firstNonZeroField(
        getField(`${pkStaticName.DIS_RENT}.${index}.${pkStaticValueKeys.XX}`),
        getField(`${pkStaticName.DIS_WAITING_DURATION}.${index}.${pkStaticValueKeys.XX}`)
      );
      obj.diswait = obj.vertexes.diswait.Value;

      let DAYS = getFieldValue(`${pkStaticName.DIS_WAITING_DURATION}.${index}.${pkStaticValueKeys.DAYS}`);
      if (!obj.diswait && DAYS && !isNaN(parseInt(DAYS))) {
        obj.diswait = parseInt(DAYS) / 30;
      }

      obj.disaccident = [];

      result.push(obj);
    }
    return result;
  }, [getField, getFieldValue, getFieldsCount]);

  const getRetirementBenefitTable = useCallback(() => {
    const count: number =
      getTableFieldsCount(pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE) ||
      getTableFieldsCount(pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE) ||
      getTableFieldsCount(pkStaticName.PROJECTED_ANNUAL_RENT_AT_AGE) ||
      getTableFieldsCount(pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE);

    let resultBenefits: Array<RetirementBenefitItem> = [];

    for (let index = 0; index < count; index++) {
      let obj: RetirementBenefitItem = {
        vertexes: {}
      } as RetirementBenefitItem;
      obj.vertexes.pensionage = getField(
        `${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.AGE}`
      );
      obj.pensionage = obj.vertexes.pensionage.Value;

      obj.vertexes.pensioncapital = firstNonZeroField(
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL_WITH_INT}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL_WITH_INT}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL_WITHOUT_INT}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL_WITHOUT_INT}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL_NO_INT}`),
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL_NO_INT}`)
      );
      if (!isNaN(obj.vertexes.pensioncapital.Value)) {
        obj.vertexes.pensioncapital.Value = Math.trunc(obj.vertexes.pensioncapital.Value);
      }
      obj.pensioncapital = obj.vertexes.pensioncapital.Value;

      obj.vertexes.pensionyear = firstNonZeroField(
        getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.ANNUAL_RENT_WITH_INT}`),
        getField(
          `${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${index}.${pkStaticValueKeys.ANNUAL_RENT_WITH_INT}`
        ),
        getField(
          `${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${index}.${pkStaticValueKeys.ANNUAL_RENT_WITHOUT_INT}`
        ),
        getField(
          `${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${index}.${pkStaticValueKeys.ANNUAL_RENT_WITHOUT_INT}`
        ),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL_WITH_INT}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL_WITH_INT}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL_WITHOUT_INT}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL_WITHOUT_INT}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_AGE}.${index}.${pkStaticValueKeys.TOTAL_NO_INT}`),
        getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${index}.${pkStaticValueKeys.TOTAL_NO_INT}`)
      );
      if (!isNaN(obj.vertexes.pensionyear.Value)) {
        obj.vertexes.pensionyear.Value = Math.trunc(obj.vertexes.pensionyear.Value);
      }
      obj.pensionyear = obj.vertexes.pensionyear.Value;

      resultBenefits.push(obj);
    }
    resultBenefits.sort((a: RetirementBenefitItem, b: RetirementBenefitItem) => {
      if (a.pensionage > b.pensionage) {
        return 1;
      } else if (a.pensionage < b.pensionage) {
        return -1;
      } else {
        return 0;
      }
    });
    return resultBenefits;
  }, [getField, getTableFieldsCount]);

  const firstNonZeroField: any = function(...args: any[]) {
    let zeroElement: any;
    if (args.length !== 0) {
      for (var i = 0; i < args.length; ++i) {
        if (
          args[i] !== null &&
          args[i] !== undefined &&
          args[i] !== '' &&
          args[i].Value !== null &&
          args[i].Value !== undefined &&
          args[i].Value !== ''
        ) {
          if (Number(args[i].Value) !== 0) {
            return args[i];
          } else {
            zeroElement = args[i];
          }
        }
      }
    }
    return zeroElement ? zeroElement : {};
  };
  /*const firstNonZero: any = function(...args: any[]) {
    let returnZero: boolean = false;
    if (args.length != 0) {
      for (var i = 0; i < args.length; ++i) {
        if (args[i] !== null && args[i] !== undefined && args[i] !== '') {
          if (Number(args[i]) !== 0) {
            return args[i];
          } else {
            returnZero = true;
          }
        }
      }
    }
    return returnZero ? '0' : undefined;
  };*/

  const setFieldValue = (name: string, value: any) => {
    const names: Array<string> = name.split('.');
    if (names.length === 1) {
      setState((state: PkScanResult) => ({ ...state, [name]: value }));
    } else if (names.length === 3) {
      let array: Array<any> = state[names[0]] as Array<any>;
      array[Number(names[1])] = { ...array[Number(names[1])], [names[2]]: value };
      setState((state: PkScanResult) => ({ ...state, [names[0]]: array }));
    }
  };

  const setFieldValues = (fieldValues: FieldValuePair[]) => {
    if (fieldValues && Array.isArray(fieldValues)) {
      let newFields: { [key: string]: any } = {};
      fieldValues.forEach((field) => {
        const names: Array<string> = field.name.split('.');
        if (names.length === 1) {
          newFields = { ...newFields, [field.name]: field.value };
        } else if (names.length === 3) {
          let array: Array<any> = state[names[0]] as Array<any>;
          array[Number(names[1])] = { ...array[Number(names[1])], [names[2]]: field.value };

          newFields = { ...newFields, [names[0]]: array };
        }
      });
      setState((state: PkScanResult) => ({ ...state, ...newFields }));
    }
  };

  const removeFromList = (name: string, index: number) => {
    let updatedList: Array<any> = state[name];
    updatedList.splice(index, 1);
    setState((state: PkScanResult) => ({ ...state, [name]: updatedList }));
    if (validator) {
      validator.purgeFields();
      validator.messagesShown = true;
      validator.forceUpdate();
    }
  };

  const addItemToList = (name: string) => {
    setState((state: PkScanResult) => ({ ...state, [name]: [...state[name], { vertexes: {} }] }));
  };

  const onClick = (x: Function, name: string, vertex?: any) => {
    if (vertex && vertex.ResponseItem) {
      x(getFieldBoundaryByVertex(vertex));
    } else {
      x(undefined);
    }
  };

  const getFieldBoundaryByVertex = (vertex: any) => {
    const itemNames: Array<string> = vertex.Name.split('.');
    setCurrent(vertex.ResponseItem.PageIndex);
    return getBoundaries(vertex.ResponseItem, itemNames[itemNames.length - 1]);
  };

  const dateFromString = (str: string) => {
    let outDate: any = undefined;
    if (str) {
      try {
        if (isNaN(Date.parse(str))) {
          let dateParts = str.split('.');
          if (dateParts.length === 3)
            outDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]), parseInt(dateParts[0]));
        } else {
          outDate = new Date(Date.parse(str));
        }
      } catch (ex) {
        outDate = undefined;
      }
    }
    return outDate;
  };
  useEffect(() => {
    if (response && !isInitialData(docScans)) {
      let newObject: PkScanResult = {} as PkScanResult;
      newObject.vertexes = {};

      newObject.vertexes.date = getField(`${pkStaticName.QUALIFYING_DATE}.${pkStaticValueKeys.DATE}`);
      newObject.date = newObject.vertexes.date.Value;

      newObject.vertexes.company = getField(`company`);
      newObject.company = newObject.vertexes.company.Value;

      newObject.vertexes.incomeyear = getField(`${pkStaticName.ANNUAL_SALARY}.${pkStaticValueKeys.TOTAL}`);
      newObject.incomeyear = newObject.vertexes.incomeyear.Value;

      newObject.vertexes.incomeinsured = getField(`${pkStaticName.INSURED_ANNUAL_SALARY}.${pkStaticValueKeys.TOTAL}`);
      newObject.incomeinsured = newObject.vertexes.incomeinsured.Value;
      if (!newObject.incomeinsured) {
        newObject.vertexes.incomeinsured = getField(
          `${pkStaticName.INSURED_ANNUAL_SALARY_SAVING}.${pkStaticValueKeys.TOTAL}`
        );
        newObject.incomeinsured = newObject.vertexes.incomeinsured.Value;
      }

      newObject.vertexes.workload = getField(`${pkStaticName.LEVEL_OF_EMPLOYMENT}.${pkStaticValueKeys.NUMBER}`);
      newObject.workload = parseFloat(newObject.vertexes.workload.Value);

      if (!newObject.workload) {
        newObject.vertexes.workload = getField(`${pkStaticName.LEVEL_OF_EMPLOYMENT}.${pkStaticValueKeys.PERCENT}`);
        newObject.workload = parseFloat(newObject.vertexes.workload.Value);
      }

      newObject.vertexes.creditbvg = getField(`${pkStaticName.EXISTING_PENSION_ASSETS}.${pkStaticValueKeys.BVG}`);
      newObject.creditbvg = newObject.vertexes.creditbvg.Value;
      newObject.vertexes.creditabovebvg = getField(
        `${pkStaticName.EXISTING_PENSION_ASSETS}.${pkStaticValueKeys.ABOVE_BVG}`
      );
      newObject.creditabovebvg = newObject.vertexes.creditabovebvg.Value;

      newObject.vertexes.credittotal = getField(`${pkStaticName.EXISTING_PENSION_ASSETS}.${pkStaticValueKeys.TOTAL}`);
      newObject.credittotal = newObject.vertexes.credittotal.Value;
      if (
        (!newObject.credittotal || !(Number(newObject.credittotal) > 0)) &&
        newObject.creditbvg &&
        newObject.creditabovebvg &&
        Number(newObject.creditbvg) > 0 &&
        Number(newObject.creditabovebvg)
      ) {
        newObject.credittotal = newObject.creditbvg + newObject.creditabovebvg;
      }

      if (!newObject.credittotal && newObject.date) {
        const cells = getFieldValue('RETIREMENT_ASSETS_ON.DATE', 'array').filter((cell: IkScanResultItem) =>
          cell.Values.find(
            (val: IkScanResultItemValue) => val.SystemName === pkStaticValueKeys.DATE && val.Value === newObject.date
          )
        );
        if (cells.length > 0) {
          const valEntry = cells[0].Values.find(
            (val: IkScanResultItemValue) => val.SystemName === pkStaticValueKeys.TOTAL
          );
          if (valEntry) {
            newObject.credittotal = valEntry;
          }
        }
      }

      newObject.vertexes.maxpayin = firstNonZeroField(
        getField(`${pkStaticName.POSSIBLE_BUYIN_AMOUNT}.${pkStaticValueKeys.TOTAL}`)
      );
      newObject.maxpayin = newObject.vertexes.maxpayin.Value;

      newObject.vertexes.maxwef = firstNonZeroField(
        getField(`${pkStaticName.POSSIBLE_WITHDRAWAL_HOME_OWNERSHIP}.${pkStaticValueKeys.TOTAL}`),
        getField(`${pkStaticName.POSSIBLE_WITHDRAWAL_HOME_OWNERSHIP}.${pkStaticValueKeys.BVG}`)
      );
      newObject.maxwef = newObject.vertexes.maxwef.Value;

      newObject.vertexes.gotwef = getField(`${pkStaticName.WITHDRAWAL_HOME_OWNERSHIP}.${pkStaticValueKeys.TOTAL}`);
      newObject.gotwef = newObject.vertexes.gotwef.Value;

      newObject.isChildAvailable =
        getFieldValue(`${pkStaticName.DIS_CHILD_RENT}.${pkStaticValueKeys.ANNUAL_TOTAL}`) ||
        getFieldValue(`${pkStaticName.DIS_CHILD_RENT}.${pkStaticValueKeys.ANNUAL_ILLNESS}`) ||
        getFieldValue(`${pkStaticName.DIS_WAITING_DURATION}.${pkStaticValueKeys.CHILD_XX}`)
          ? true
          : false;
      newObject.vertexes.dischild = firstNonZeroField(
        getField(`${pkStaticName.DIS_CHILD_RENT}.${pkStaticValueKeys.ANNUAL_TOTAL}`),
        getField(`${pkStaticName.DIS_CHILD_RENT}.${pkStaticValueKeys.ANNUAL_ILLNESS}`)
      );
      newObject.dischild = newObject.vertexes.dischild.Value;
      newObject.dischildCheck = [];

      newObject.vertexes.widowvalue = firstNonZeroField(
        getField(`${pkStaticName.WIDOW_RENT}.${pkStaticValueKeys.ANNUAL_TOTAL}`),
        getField(`${pkStaticName.WIDOW_RENT}.${pkStaticValueKeys.ANNUAL_ILLNESS}`)
      );
      newObject.widowvalue = newObject.vertexes.widowvalue.Value;
      newObject.widowaccident = [];

      newObject.annualIllnessWidowCheck = [1];

      newObject.vertexes.orphanvalue = firstNonZeroField(
        getField(`${pkStaticName.ORPHAN_RENT}.${pkStaticValueKeys.ANNUAL_TOTAL}`),
        getField(`${pkStaticName.ORPHAN_RENT}.${pkStaticValueKeys.ANNUAL_ILLNESS}`)
      );
      newObject.orphanvalue = newObject.vertexes.orphanvalue.Value;

      newObject.retirement = getRetirementBenefitTable();
      if (!newObject.retirement || !newObject.retirement.length || newObject.retirement.length === 0) {
        // Table mapping failed. Looking for single rows
        newObject.retirement = [];
        newObject.vertexes.retirement = [];
        let obj: RetirementBenefitItem = {
          vertexes: {}
        } as RetirementBenefitItem;

        obj.vertexes.pensioncapital = firstNonZeroField(
          getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${pkStaticValueKeys.TOTAL_WITH_INT}`),
          getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${pkStaticValueKeys.TOTAL}`),
          getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${pkStaticValueKeys.TOTAL_WITHOUT_INT}`),
          getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${pkStaticValueKeys.TOTAL_NO_INT}`)
        );
        obj.pensioncapital = obj.vertexes.pensioncapital.Value;

        obj.vertexes.pensionyear = firstNonZeroField(
          getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${pkStaticValueKeys.ANNUAL_RENT_WITH_INT}`),
          getField(`${pkStaticName.PROJECTED_PENSION_ASSETS_AT_ENDAGE}.${pkStaticValueKeys.ANNUAL_RENT_WITHOUT_INT}`),
          getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${pkStaticValueKeys.TOTAL_WITH_INT}`),
          getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${pkStaticValueKeys.TOTAL}`),
          getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${pkStaticValueKeys.TOTAL_WITHOUT_INT}`),
          getField(`${pkStaticName.PROJECTED_ANNUAL_RENT_AT_ENDAGE}.${pkStaticValueKeys.TOTAL_NO_INT}`)
        );
        obj.pensionyear = obj.vertexes.pensionyear.Value;

        if (obj.pensioncapital || obj.pensionyear) {
          obj.vertexes.pensionage = getField(
            `${pkStaticName.PROJECTED_PENSION_ASSETS_AT_AGE}.${pkStaticValueKeys.AGE}`
          );
          obj.pensionage = obj.vertexes.pensionage.Value;
          if (!obj.pensionage) {
            // Fallback #1: Try to get gender from external Moneto/QC data.
            if (personData && personData.gender && !isNaN(personData.gender as any)) {
              if (personData.gender === 1)
                // Male.
                obj.pensionage = 65;
              else if (personData.gender === 1)
                // Female.
                obj.pensionage = 64;
            }
          }
          if (!obj.pensionage) {
            // Fallback #2: Extract Gender field from OCR form.
            let gender: any = getFieldValue(`${pkStaticName.GENDER}.${pkStaticValueKeys.DEFAULT}`);
            if (gender && gender.toLowerCase) {
              if (gender.toLowerCase().startsWith('m')) {
                obj.pensionage = 65;
              } else if (gender.toLowerCase().startsWith('f') || gender.toLowerCase().startsWith('w')) {
                obj.pensionage = 64;
              }
            }
          }
          if (!obj.pensionage) {
            // Fallback #3: Calculate retirement age based on extracted dates
            let birthdateString: any = getFieldValue(`${pkStaticName.BIRTHDATE}.${pkStaticValueKeys.DATE}`);
            let retirementAgeString: any = getFieldValue(`${pkStaticName.RETIREMENT_AGE}.${pkStaticValueKeys.DATE}`);
            let birthdateDate = dateFromString(birthdateString);
            let retirementAgeDate = dateFromString(retirementAgeString);
            if (birthdateDate && retirementAgeDate) {
              obj.pensionage = Math.round((retirementAgeDate - birthdateDate) / (1000 * 60 * 60 * 24 * 365.25));
            }
          }
        }

        if (obj.pensioncapital || obj.pensionyear || obj.pensionage) {
          newObject.retirement.push(obj);
        }
      }

      newObject.disability = getDisabilityPensionItems();
      newObject.deathBenefit = getDeathBenefitItems();
      setState(newObject);
      saveInitialScanResults(newObject);

      validator.messagesShown = true;
      validator.forceUpdate();
    }
  }, [
    response,
    docScans,
    getDeathBenefitItems,
    getDisabilityPensionItems,
    getField,
    getFieldValue,
    getRetirementBenefitTable,
    personData,
    saveInitialScanResults,
    validator
  ]);

  return images && images.length > 0 ? (
    <PortalScanVerification
      t={t}
      cardName={cardName}
      onCancel={onCancel}
      onBackToScan={onBackToScan}
      renderContent={(x: Function) => (
        <PkScanResultComponent
          setFieldValue={setFieldValue}
          setFieldValues={setFieldValues}
          addItemToList={addItemToList}
          t={t}
          cardName={cardName}
          removeFromList={removeFromList}
          onClick={(name: string, vertex?: any) => onClick(x, name, vertex)}
          state={state}
          validator={validator}
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
    <DummyProgressPopup />
  );
};

export default PkAuszugResults;

interface PkScanResultComponentProps {
  setFieldValue: (x: string, y: any) => void;
  setFieldValues: (fieldValues: FieldValuePair[]) => void | undefined;
  state: PkScanResult;
  t: any;
  cardName: string | undefined;
  onClick?: (name: string) => void;
  addItemToList: (name: string) => void;
  removeFromList: (name: string, index: number) => void;
  validator?: Validator;
}

export const PkScanResultComponent: React.FC<PkScanResultComponentProps> = ({
  setFieldValue,
  setFieldValues,
  state,
  t,
  cardName,
  onClick,
  addItemToList,
  removeFromList,
  validator
}) => (
  <>
    <PersonalData
      cardName={cardName}
      t={t}
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      onClick={onClick}
      validator={validator}
    />
    <SalaryData
      t={t}
      cardName={cardName}
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      onClick={onClick}
      validator={validator}
    />
    <PensionActivesData
      t={t}
      cardName={cardName}
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      onClick={onClick}
      validator={validator}
    />
    <OwnershipWithdrawData
      t={t}
      cardName={cardName}
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      onClick={onClick}
      validator={validator}
    />
    <RetirementBenefits
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      cardName={cardName}
      t={t}
      removeFromList={removeFromList}
      addItemToList={addItemToList}
      onClick={onClick}
      validator={validator}
    />
    <DisabilityPension
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      cardName={cardName}
      t={t}
      removeFromList={removeFromList}
      addItemToList={addItemToList}
      onClick={onClick}
      validator={validator}
    />
    <SurvivorsProtection
      t={t}
      cardName={cardName}
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      onClick={onClick}
      validator={validator}
    />
    <DeathBenefit
      t={t}
      cardName={cardName}
      setFieldValue={setFieldValue}
      setFieldValues={setFieldValues}
      value={state}
      removeFromList={removeFromList}
      addItemToList={addItemToList}
      onClick={onClick}
      validator={validator}
    />
  </>
);
