import React, { useState, useEffect } from 'react';
import { Page, PrimaryButton, GeneralText } from '../../../components/common/styled';
import Wizard from '../../../app_core/app.wizard';
import { Step } from '../../../app_core/app.wizard';
import { useTranslation } from 'react-i18next';
import QCAnalysis from '../components/QCAnalysis';
import QCCalculator from '../components/QCCalculator';

import { KNumber, KDatePicker, KFormCard, KSelect } from '../../../components/KForm';

import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import PortalComponent from '../../../components/common/portal';
import DrawerComponent from '../../../components/common/drawer';
import DrawerContent from '../../../components/common/drawerContent';
import { ModuleHolder } from '../../../app_modules/module.styled';
import { ModuleCol } from '../../../app_modules/module.core';
import { useWindowSize } from '../../../utils/handleWindowResizeHook';

interface ActiveQC_Props {
  gender: number[] | undefined;
  birthYear: string | undefined;
  income: number | undefined;
  firstYear: string | undefined;
  [key: string]: any;
}

const QuickCheckPage = (props: any) => {
  const [isValid, setValid] = useState<boolean>(false);

  const [activeQC, setActiveQC] = useState<ActiveQC_Props>({
    gender: undefined,
    birthYear: undefined,
    income: undefined,
    firstYear: undefined
  });

  const { t } = useTranslation('quickCheck');

  const [data, setData] = useState<any>();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [suggestedYear, setSuggestedYear] = useState<number>();

  const [modules] = useState<string[]>(['quickCheckForm', 'quickCheckAnalysis']);
  const initValidModules: { [key: string]: number } = {};
  const titles: string[] = [];
  modules.forEach((e, i) => {
    initValidModules[e] = 0;
    titles.push(t(`moduleTitles.${e}`));
  });

  const [validModules, setValidModules] = useState<{ [key: string]: number }>({ ...initValidModules });
  const [activeModule, setActiveModule] = useState<string>(modules[0]);

  const setFieldValue = (name: string, value: any) => {
    setActiveQC({ ...activeQC, [name]: value });
    if (name === 'birthYear') {
      setSuggestedYear(+value + 21);
    }
  };

  const nextStep = () => {
    console.log(data);
    setActiveModule(modules[1]);
    setValidModules({ ...validModules, [modules[0]]: 2 });
    if (isValid) {
      setData(
        QCCalculator(
          (activeQC.gender && activeQC.gender[0]) || 1,
          (activeQC.income && +activeQC.income) || 50000,
          (activeQC.birthYear && +activeQC.birthYear) || 1980,
          (activeQC.firstYear && +activeQC.firstYear) || 2005
        )
      );
    }
  };

  const toggleHelp = (id: string) => {
    setOpen(!isOpen);
    setSelectedId(id);
  };

  useEffect(() => {
    const validateQC = () => {
      if (
        activeQC.gender === undefined ||
        activeQC.birthYear === undefined ||
        activeQC.birthYear === 'Invalid date' ||
        activeQC.income === undefined ||
        activeQC.income === 0 ||
        isNaN(activeQC.income) ||
        activeQC.firstYear === undefined ||
        activeQC.firstYear === 'Invalid date'
      ) {
        return false;
      } else {
        return true;
      }
    };

    let isValidLocal: boolean = validateQC();
    setValid(isValidLocal);

    if (isValidLocal) {
      setValidModules((validModules) => {
        return { ...validModules, [modules[0]]: 2 };
      });
      setData(
        QCCalculator(
          (activeQC.gender && activeQC.gender[0]) || 1,
          (activeQC.income && +activeQC.income) || 50000,
          (activeQC.birthYear && +activeQC.birthYear) || 1980,
          (activeQC.firstYear && +activeQC.firstYear) || 2005
        )
      );
    }
  }, [activeQC, modules]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Page color={'#efefef'} paddingBottom={150}>
      <Wizard
        titles={titles}
        modules={modules}
        isMobile={useWindowSize()}
        moduleType={'standard'}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        validModules={validModules}
        activeCol={1}
        setActiveCol={() => {}}
      >
        <Step key={0}>
          <ModuleHolder>
            <ModuleCol name={'self'} target={'quick'} colNumber={1} activeCol={1} partner={false} isExtended={false}>
              <KFormCard
                id={'qc1'}
                cardName={'quickcheck_1'}
                cardNumber={1}
                state={props.isCardValid}
                toggleHelp={toggleHelp}
              >
                <KFormSection>
                  <KFormRow>
                    <KFormCol width={1 / 2}>
                      <KSelect
                        name={'gender'}
                        label={t(`form.gender`)}
                        itemsName={[0, 1, 2].map((e) => {
                          return t(`form.genderItems.${e}`);
                        })}
                        itemsValue={[1, 2, 3]}
                        fieldValue={activeQC.gender}
                        setFieldValue={setFieldValue}
                      />
                    </KFormCol>
                    <KFormCol width={1 / 2} force={true}>
                      <KDatePicker
                        name={'birthYear'}
                        label={t(`form.birthYear`)}
                        format={'YYYY'}
                        fieldValue={activeQC.birthYear}
                        setFieldValue={setFieldValue}
                      />
                    </KFormCol>
                  </KFormRow>
                  <KFormRow>
                    <KFormCol width={1 / 2}>
                      <KNumber
                        name={'income'}
                        label={t(`form.income`)}
                        fieldValue={activeQC.income}
                        setFieldValue={setFieldValue}
                      />
                    </KFormCol>
                  </KFormRow>
                  <KFormRow>
                    <KFormCol width={1} force={true}>
                      <GeneralText fontSize="14" noMargin style={{ marginTop: '20px' }}>
                        {t(`form.firstYear`) +
                          (suggestedYear ? ` ( ${t(`form.firstYearSuggestion`)} ${suggestedYear} )` : '')}
                      </GeneralText>
                    </KFormCol>
                    <KFormCol width={1} force={true}>
                      <KDatePicker
                        name={'firstYear'}
                        label={t(`form.firstYearLabel`)}
                        format={'YYYY'}
                        fieldValue={activeQC.firstYear}
                        setFieldValue={setFieldValue}
                      />
                    </KFormCol>
                  </KFormRow>
                </KFormSection>
              </KFormCard>
              {isValid ? (
                <PrimaryButton main={true} center={true} onClick={nextStep}>
                  {t(`form.next`)}
                </PrimaryButton>
              ) : (
                undefined
              )}
            </ModuleCol>
          </ModuleHolder>
        </Step>

        <Step key={1}>
          <>
            <ModuleHolder>
              <ModuleCol name={'self'} target={'quick'} colNumber={1} activeCol={1} partner={false} isExtended={true}>
                <QCAnalysis data={data} />
              </ModuleCol>
            </ModuleHolder>
          </>
        </Step>
      </Wizard>
      <PortalComponent isOpen={isOpen} toggle={toggleHelp}>
        <DrawerComponent position="right">
          <DrawerContent currentId={selectedId} activeModule={'quickCheck'} />
        </DrawerComponent>
      </PortalComponent>
    </Page>
  );
};

export default QuickCheckPage;
