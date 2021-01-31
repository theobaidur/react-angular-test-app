import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Wizard, { Step } from './app.wizard';
import { Page, PrimaryButton } from '../components/common/styled';
import ModuleProvider, { ModuleHelp } from '../app_modules/module.core';
import { ModuleProviderBase_Props } from '../app_modules/module.interfaces';
import { AppProvider_Props } from './app.interfaces';
import Analyzer from '../app_modules/analyzer/analyzer';
import { useStore, useDispatch } from 'react-redux';
import { useWindowSize } from '../utils/handleWindowResizeHook';
import { dispatchApplications } from '../redux/dispatcher';
import { ButtonsContainer, AppConsultantContact } from './app.styled';
import { ConsultantAvatar, ConsultantPanel } from '../components/common/consultantPanel/consultantPanel';
import dossierProvider from '../providers/dossierProvider';
import { Dossier } from '../redux/initialState';


const AppProvider: React.FC<AppProvider_Props> = ({ appName, history }) => {
  const { t } = useTranslation(['modules', 'routes', 'global']);
  const store = useStore();
  const state = store.getState();
  const dispatch = useDispatch();
  const isMobile: boolean = useWindowSize();

  useEffect(() => {
    return () => {
      dispatchApplications(dispatch, store.getState());
    };
  }, [dispatch, store]);

  const filteredModules = state.authInfo.applications[appName].filter;
  const initValidModules: { [key: string]: number } = {};
  const modules: string[] = [];
  const moduleTypes: string[] = [];
  const titles: string[] = [];

  filteredModules.map((module: ModuleProviderBase_Props) => {
    const progress = module.moduleCore && module.moduleCore.progress;
    initValidModules[module.moduleName] = progress && progress.done ? 2 : 0;
    modules.push(module.moduleName);
    titles.push(t(`moduleTitles.${module.moduleName}`));
    moduleTypes.push(module.moduleType ? module.moduleType : 'standard');
    return true;
  });

  const [validModules, setValidModules] = useState<{ [key: string]: number }>({ ...initValidModules });
  const validateModule = useCallback(
    (name: string, valid: number) => {
      setValidModules((validModules) => {
        return { ...validModules, [name]: valid };
      });
    },
    [setValidModules]
  );

  const [activeModule, setActiveModule] = useState<string>(
    modules.find((x: string) => initValidModules[x] === 0) || modules[0]
  );
  const stepToModule = (back: boolean = false) => {
    saveProgress();
    const index = modules.indexOf(activeModule) + (back ? -1 : 1);
    const toModule = modules[index];
    setActiveModule(toModule);
  };

  const saveProgress = () => {
    dossierProvider.updateDossierInfo(state as Dossier, ()=>{
      console.log('Info updated');
    }, err=>{
      console.log('Something went wrong while updating', {err});
    });
  };

  const [activeHelp, setActiveHelp] = useState<string>('');
  const [isHelpOpen, setHelpOpen] = useState<boolean>(false);
  const toggleHelp = (id: string = '') => {
    setActiveHelp(id);
    setHelpOpen(!isHelpOpen);
  };

  const [activeCol, setActiveCol] = useState<1 | 2>(1);

  const [isConsultantPanelOpen, setConsultantPanelOpen] = useState<boolean>(false);
  const toggleConsultantPanel = () => setConsultantPanelOpen((open: boolean) => !open);

  const renderButtonContainer = () => {
    return (
      <ButtonsContainer>
        {modules.indexOf(activeModule) > 0 ? (
          <PrimaryButton
            outlined
            center={true}
            visibility={modules.indexOf(activeModule) > 0 ? 'visible' : 'hidden'}
            onClick={() => {
              return stepToModule(true);
            }}
          >
            {t('modules:back')}
          </PrimaryButton>
        ) : null}

        {appName === 'profile' || modules.indexOf(activeModule) < modules.length - 1 ? (
          <PrimaryButton
            main={true}
            center={true}
            visibility={
              appName === 'profile' || modules.indexOf(activeModule) < modules.length - 1 ? 'visible' : 'hidden'
            }
            disabled={validModules[activeModule] !== 2 && moduleTypes[modules.indexOf(activeModule)] !== 'analyzer'}
            onClick={() => {
              return appName === 'profile' ? saveProgress() : stepToModule();
            }}
          >
            {t(`modules:next`)}
          </PrimaryButton>
        ) : null}
      </ButtonsContainer>
    );
  };

  return (
    <>
      <Page paddingBottom={150}>
        {
        state.specialist && (state.specialist.state === 0 || state.specialist.state === 1) && (
          <ConsultantPanel
            isOpen={isConsultantPanelOpen}
            toggle={toggleConsultantPanel}
            consultantState={
              state.specialist.state !== 0 && (state.specialist.full_name || state.specialist.mail) ? 1 : 0
            }
            consultantName={state.specialist.full_name}
            consultantPhone={state.specialist.phone}
            consultantEmail= {state.specialist.mail}
            consultantPicture={state.specialist.profile_pic ? state.specialist.profile_pic : undefined}
          />
        )
        }
        {
        state.specialist && (state.specialist.state === 0 || state.specialist.state === 1) && (
          <AppConsultantContact>
            <ConsultantAvatar specialist={state.specialist} togglePanel={toggleConsultantPanel} t={t} withText={false}/>
          </AppConsultantContact>
        )
        }
        <Wizard
          modules={modules}
          titles={titles}
          activeModule={activeModule}
          isMobile={isMobile}
          setActiveModule={setActiveModule}
          moduleType={moduleTypes[modules.indexOf(activeModule)]}
          validModules={validModules}
          activeCol={activeCol}
          t={t}
          setActiveCol={(number: 1 | 2) => setActiveCol(number)}
        >
          {filteredModules.map((module: ModuleProviderBase_Props, i: number) => {
            return (
              <Step key={i}>
                
                {module.moduleType === 'analyzer' ? (
                  <Analyzer
                    key={i}
                    history={history}
                    appName={appName}
                    activeCol={activeCol}
                    validState={validModules.analyzer}
                    toggleHelp={toggleHelp}
                    validateModule={validateModule}
                    mode={module.mode || 1}
                    alternate={module.alternate || 1}
                    filteredModules={filteredModules}
                  />
                ) : (
                  <ModuleProvider
                    key={i}
                    {...module}
                    activeCol={activeCol}
                    validState={validModules[module.moduleName]}
                    validateModule={validateModule}
                    toggleHelp={toggleHelp}
                  />
                )}
              </Step>
            );
          })}
        </Wizard>
        {window.innerWidth >= 768 ? renderButtonContainer() : null}
        <ModuleHelp
          isOpen={isHelpOpen}
          history={history}
          activeHelp={activeHelp}
          toggleHelp={toggleHelp}
          activeModule={activeModule}
        />
      </Page>
      {window.innerWidth < 768 ? renderButtonContainer() : null}
    </>
  );
};

export default AppProvider;

