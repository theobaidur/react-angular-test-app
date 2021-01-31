import React, { useState, useEffect, useCallback } from 'react';
import { Page, Row, Col, Heading1 } from '../../components/common/styled';
import { KTimePicker, KSelect, KDatePicker, KCheck, KNumber, KText, KRadio, KSwitch } from '../../components/KForm';
import { useTranslation } from 'react-i18next';
import Validator from '../../utils/validator';
import AppConstants from '../../constants/appConstants';
import KSlider from '../../components/KForm/KSlider';
import notificationService from '../../services/notificationService';
import Tooltip from '../../components/common/tooltip';
import KAutosuggestText from '../../components/KForm/KAutosuggestText';

interface ActiveQC_Props {
  checkbox: number[] | undefined;
  radiobutton: number[] | undefined;
  select: number[] | undefined;
  birthYear: string | undefined;
  switch: boolean;
  time: string | undefined;
  text: string | undefined;
  income: number | undefined;
  firstYear: string | undefined;
  slider: number | undefined;
  [propName: string]: any;
}

const StyleGuidePage: React.FC<any> = (props: any) => {
  const { t } = useTranslation('styleGuide');
  const [validator] = useState<Validator>(
    new Validator({
      messages: {
        min: 'gafsaf asfd asfs',
        before: 'dwewryghr tre yre yre yeyrr'
      }
    })
  );
  const [activeQC, setActiveQC] = useState<ActiveQC_Props>({
    checkbox: undefined,
    radiobutton: undefined,
    birthYear: undefined,
    birthYear1: undefined,
    birthYear2: undefined,
    income: 0,
    income1: 1,
    income2: undefined,
    switch: false,
    time: undefined,
    select: undefined,
    text: undefined,
    firstYear: undefined,
    slider: undefined
  });
  const setFieldValue = useCallback((name: string, value: any) => {
    setActiveQC((activeQC) => {
      return { ...activeQC, [name]: value };
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setFieldValue('income', 10000);
    }, 5000);
  }, [setFieldValue]);

  return (
    <Page>
      <Row>
        <Col layout={1 / 2}>
          <KCheck
            name={'checkbox'}
            label={t(`check`)}
            itemsName={[0, 1, 2].map((e) => {
              return t(`checkItems.${e}`);
            })}
            itemsValue={[1, 2, 3]}
            multiple={true}
            fieldValue={activeQC.checkbox}
            setFieldValue={setFieldValue}
            validator={validator}
            validations="required|in:1,2"
          />
        </Col>
        <Col layout={1 / 2}>
          <KRadio
            name={'radiobutton'}
            label={t(`radio`)}
            itemsName={[0, 1, 2].map((e) => {
              return t(`radioItems.${e}`);
            })}
            itemsValue={[1, 2, 3]}
            fieldValue={activeQC.radiobutton}
            setFieldValue={setFieldValue}
            validator={validator}
            validations="required|between:1,2"
          />
        </Col>
        <Col layout={1 / 2}>
          <KDatePicker
            name={'birthYear'}
            label={t(`date`)}
            fieldValue={activeQC.birthYear}
            setFieldValue={setFieldValue}
            validator={validator}
            validations={`required|after:21.04.1997,${AppConstants.DATE_FORMAT}|before:10.10.2020,${AppConstants.DATE_FORMAT}`}
          />
        </Col>
        <Col layout={1 / 2}>
          <KTimePicker
            name={'time'}
            label={t(`date`)}
            fieldValue={activeQC.time}
            setFieldValue={setFieldValue}
            validator={validator}
            validations="required"
          />
        </Col>
        <Col layout={1 / 2}>
          <KNumber
            name={'income'}
            label={t(`numberInput`)}
            fieldValue={activeQC.income}
            setFieldValue={setFieldValue}
            decimal={4}
            validator={validator}
            isPercent
            validations="required|max:200,num|min:25,num"
          />
        </Col>
        <Col layout={1 / 2}>
          <KText
            name={'text'}
            label={t(`textInput`)}
            validator={validator}
            validations="required|email"
            fieldValue={activeQC.text}
            setFieldValue={setFieldValue}
          />
        </Col>
        <Col layout={1 / 2}>
          <KSelect
            name="select"
            label={t(`select`)}
            itemsName={[0, 1, 2].map((e) => t(`selectItems.${e}`))}
            itemsValue={[1, 2, 3]}
            setFieldValue={setFieldValue}
            isMulti
            fieldValue={activeQC.select}
            validator={validator}
            validations="required"
          />
        </Col>
        <Col layout={1 / 2}>
          <KSelect
            name="select"
            label={t(`select`)}
            itemsName={[0, 1, 2].map((e) => t(`selectItems.${e}`))}
            itemsValue={[1, 2, 3]}
            setFieldValue={setFieldValue}
            isMulti
            isClearable={false}
            validator={validator}
            validations="required"
            isSearchable={false}
            fieldValue={activeQC.select}
          />
        </Col>
        <Col layout={1 / 2}>
          <KSelect
            name="select"
            label={t(`select`)}
            itemsName={[0, 1, 2].map((e) => t(`selectItems.${e}`))}
            itemsValue={[1, 2, 3]}
            setFieldValue={setFieldValue}
            validator={validator}
            validations="required"
            fieldValue={activeQC.select}
          />
        </Col>
        <Col layout={1 / 2}>
          <KSelect
            name="select"
            label={t(`select`)}
            itemsName={[0, 1, 2].map((e) => t(`selectItems.${e}`))}
            itemsValue={[1, 2, 3]}
            setFieldValue={setFieldValue}
            isClearable
            validator={validator}
            validations="required"
            isDisabled
            fieldValue={activeQC.select}
          />
        </Col>
        <Col layout={1 / 2}>
          <KSwitch
            name="switch"
            label={t(`select`)}
            validator={validator}
            validations="accepted"
            setFieldValue={setFieldValue}
            fieldValue={activeQC.switch}
          />
        </Col>
        <Col layout={1 / 2}>
          <KSlider
            name={'slider'}
            min={0}
            max={100}
            step={1}
            markStep={5}
            defaultValue={50}
            autoHideLabel={true}
            marks={true}
            fieldValue={activeQC.slider}
            setFieldValue={setFieldValue}
          />
        </Col>
        <Col layout={1 / 2}>
          <Tooltip title="hello world. im lyubomyr">
            <button
              onClick={() => {
                notificationService.showSuccessMessage('I love hooks');
              }}
            >
              {' '}
              click
            </button>
          </Tooltip>
        </Col>
        <Col layout={1 / 2}>
          <KAutosuggestText
            name={'assistedInput'}
            label={`Assisted Input Placeholder`}
            items={['First Option', 'Second Option', 'Third Option']}
            validations="required"
            validator={validator}
            fieldValue={activeQC.assistedInput}
            setFieldValue={setFieldValue}
          />
        </Col>
      </Row>
      <Heading1>Validators</Heading1>
      <Row>
        <Col layout={1 / 2}>
          <KDatePicker
            name={'birthYear'}
            label="First date picker"
            fieldValue={activeQC.birthYear}
            setFieldValue={setFieldValue}
            validator={validator}
            validations={`required|after:21.04.1997,${AppConstants.DATE_FORMAT}|before:10.10.2020,${AppConstants.DATE_FORMAT}`}
          />
        </Col>

        <Col layout={1 / 2}>
          <KDatePicker
            name={'birthYear1'}
            label="Second date picker"
            fieldValue={activeQC.birthYear1}
            setFieldValue={setFieldValue}
            validator={validator}
            validations={`required|after:${activeQC.birthYear},${AppConstants.DATE_FORMAT}|before:10.10.2020,${AppConstants.DATE_FORMAT}`}
          />
        </Col>
        <Col layout={1 / 2}>
          <KDatePicker
            name={'birthYear2'}
            label="Default date picker"
            fieldValue={activeQC.birthYear2}
            setFieldValue={setFieldValue}
            validator={validator}
          />
        </Col>
      </Row>
      <Row>
        <Col layout={1 / 2}>
          <KNumber
            name={'income1'}
            label={t(`numberInput`)}
            fieldValue={activeQC.income1}
            setFieldValue={setFieldValue}
            decimal={4}
            validator={validator}
            validations="required|max:200,num|min:25,num"
          />
        </Col>
        <Col layout={1 / 2}>
          <KNumber
            name={'income2'}
            label={t(`numberInput`)}
            fieldValue={activeQC.income2}
            setFieldValue={setFieldValue}
            decimal={4}
            validator={validator}
            validations={`required|max:200,num|min:${activeQC.income1},num`}
          />
        </Col>
      </Row>
    </Page>
  );
};

export const TestContent: React.FC<any> = () => (
  <div>
    hello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye
    bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye
    bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye
    bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world
    bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello
    world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye
    byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye
    bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye
    bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye
    bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world
    bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello
    world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye
    byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye
    bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye
    bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye
    bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world
    bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello
    world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye
    byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye
    bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye
    bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye
    bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye byeello world bye bye bye bye bye
  </div>
);
export default StyleGuidePage;
