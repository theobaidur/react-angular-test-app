import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useStore } from 'react-redux';
import { AnalyzerHolder } from './analyzer.styled';
import AnalyzerDiagram from './analyzer.diagram';
import { analyzerCore } from './analyzer.core';
import { CardRecommend, CardSuggestion } from './cards';
import { Heading2 } from '../../components/common/styled';
import CardWarning from './cards/cardWarning';
import * as actions from '../../redux/actions';
import dateFromString from '../../utils/dateFromString';
import { NeedsEditor, WealthEditor, PensionPrivateEditor } from './analyzer.editors';
import { ModuleProviderBase_Props } from '../module.interfaces';
import {
  ModuleWealth,
  ModuleWealthPersonCore_Props,
  ModuleWealthConnectionCore_Props
} from '../wealth/moduleWealth';
import { dispatchModule } from '../../redux/dispatcher';
import { ModulePensionPrivate } from '..';
import { ModulePensionPrivateData } from '../pensionPrivate/modulePensionPrivate';

interface Analyzer_Props {
  appName: string;
  validateModule: any;
  validState: any;
  activeCol: any;
  history: any;
  mode: number;
  alternate: number;
  filteredModules: ModuleProviderBase_Props[];
  toggleHelp: (x: string) => void;
}

const Analyzer: React.FC<Analyzer_Props> = ({
  appName,
  validateModule,
  validState,
  activeCol,
  mode,
  alternate,
  history,
  filteredModules,
  toggleHelp,
  ...props
}) => {
  const { t } = useTranslation(['module_analyzer', 'modules']);

  const dispatch = useDispatch();
  const state = useStore().getState();

  const [diagramData, setDiagramData] = useState(analyzerCore(appName, state, activeCol, mode, alternate));

  const [isNeedEditorOpen, setNeedEditorOpen] = useState<boolean>(false);
  const [isWealthEditorOpen, setWealthEditorOpen] = useState<boolean>(false);
  const [isPensionPrivateEditorOpen, setPensionPrivateEditorOpen] = useState<boolean>(false);

  const openNeedEditor = () => setNeedEditorOpen((open: boolean) => !open);
  const openWealthEditor = () => setWealthEditorOpen((open: boolean) => !open);
  const openPensionPrivateEditor = () => setPensionPrivateEditorOpen((open: boolean) => !open);

  const [needData, setNeedData] = useState<{ [name: string]: any }>({});
  const [wealthData, setWealthData] = useState<{ [name: string]: any }>({});
  const [pensionPrivateData, setPensionPrivateData] = useState<{ [name: string]: any }[]>([]);

  const names = [state.myPerson.fullName(), state.myPartner.fullName()];

  const wealthId = `${appName}${alternate}`;

  const updateDiagramData = useCallback(
    () => setDiagramData(analyzerCore(appName, state, activeCol, mode, alternate)),
    [activeCol, alternate, appName, mode, state]
  );

  const updateNeedEditorData = useCallback(() => {
    if (!diagramData) return;
    const activePerson = activeCol === 1 ? state.myPerson : state.myPartner;
    setNeedData({
      month: diagramData.need && diagramData.need.month,
      startAge:
        diagramData.need &&
        diagramData.need.start.getFullYear() - dateFromString(activePerson.birthDate).getFullYear()
    });
  }, [activeCol, diagramData, state.myPartner, state.myPerson]);

  const updateWealthEditorData = useCallback(() => {
    const activePerson = activeCol === 1 ? state.myPerson : state.myPartner;
    const personWealth = activePerson.legal.wealth;
    const conWealth = state.myConnection.legal.wealth;
    let hasWealthPerson = true,
      hasWealthCon = true;
    if (!personWealth.hasWealth || personWealth.hasWealth[0] === 2) hasWealthPerson = false;

    if (!conWealth.hasWealth || conWealth.hasWealth[0] === 2) hasWealthCon = false;

    const use = personWealth.use;
    const conUse = conWealth.use;
    const available = activePerson.result.wealth.available;
    const conUseTarget = conUse && (activeCol === 1 ? conUse.person : conUse.partner);
    const conAvailable = state.myConnection.result.wealth.available;
    const conAvailableTarget =
      conAvailable && (activeCol === 1 ? conAvailable.person : conAvailable.partner);

    const data: any = {
      hasWealthPerson: hasWealthPerson,
      hasWealthCon: hasWealthCon,
      personUse: (use && use[wealthId]) || 0,
      personAvailable: (available && available[wealthId]) || 0,
      connectionUse: (conUseTarget && conUseTarget[wealthId]) || 0,
      connectionAvailable: (conAvailableTarget && conAvailableTarget[wealthId]) || 0
    };
    setWealthData({ ...data });
  }, [
    activeCol,
    state.myConnection.legal.wealth,
    state.myConnection.result.wealth.available,
    state.myPartner,
    state.myPerson,
    wealthId
  ]);

  const updatePensionPrivateEditorData = useCallback(() => {
    const activePerson = activeCol === 1 ? state.myPerson : state.myPartner;
    const personPP = activePerson.legal.pensionPrivate;
    const data: any = [];
    personPP.array &&
      personPP.array.forEach((card: any) => {
        if (mode === 1 && 
          card.hasCapital && card.hasCapital[0] === 1 &&
          (card.capitalValue && card.capitalType && 
            (card.capitalType[0] === 1 || 
              (card.capitalType[0] === 2 && card.capitalOption && (card.capitalOption[0] === 2 || card.capitalOption[0] === 3 ) )
            )
          ) ){
          data.push({
            name: card.name,
            disc: 'cap',
            id: card.id,
            subId: undefined,
            value: card.capitalValue,
            use: card.capitalUse,
            available: card.capitalAvailable
          });
        }
        if (mode === 2 && card.disability && card.disability.length) {
          card.disability.forEach((elem: any) => {
            if( elem.type && elem.type[0] === 2 ){
              if (
                (alternate === 1 && elem.illness && elem.illness[0] === 1) ||
                (alternate === 2 && elem.accident && elem.accident[0] === 1)
              ) {
                data.push({
                  name: card.name,
                  disc: 'dis',
                  id: card.id,
                  subId: elem.id,
                  value: elem.value,
                  use: elem.use,
                  available: elem.available
                });
              }
            }
          });
        }
        if (mode === 3 && card.leftBehind && card.leftBehind.length) {
          card.leftBehind.forEach((elem: any) => {
            if( elem.type && elem.type[0] === 2 ){
              if (
                (alternate === 1 && elem.illness && elem.illness[0] === 1) ||
                (alternate === 2 && elem.accident && elem.accident[0] === 1)
              ) {
                data.push({
                  name: card.name,
                  disc: 'left',
                  id: card.id,
                  subId: elem.id,
                  value: elem.value,
                  use: elem.use,
                  available: elem.available
                });
              }
            }
          });
        }
      });
    setPensionPrivateData([ ...data ]);
  }, [activeCol, state.myPerson, state.myPartner, mode, alternate]);

  useEffect(() => {
    updateNeedEditorData();
    updateWealthEditorData();
    updatePensionPrivateEditorData();
  }, [
    state,
    diagramData,
    updateNeedEditorData,
    updateWealthEditorData,
    updatePensionPrivateEditorData
  ]);

  useEffect(() => {
    updateDiagramData();
  }, [state, activeCol, updateDiagramData]);

  const onNeedApprove = (moduleName: string) => {
    const dataChange =
      mode === 1
        ? { retirementNeed: needData.month, retirementStart: needData.startAge }
        : mode === 2
        ? { disabilityNeed: needData.month }
        : { leftBehindNeed: needData.month };
    const person = activeCol === 1 ? state.myPerson : state.myPartner;
    dispatch(
      actions.changeLegal(activeCol - 1, person, moduleName, {
        ...person.legal[moduleName],
        ...dataChange
      })
    );
    dispatch(
      actions.changeResult(activeCol - 1, person, moduleName, {
        ...person.result[moduleName],
        ...dataChange
      })
    );
    setNeedEditorOpen(false);
  };

  const onWealthApprove = (moduleName: string) => {
    const wealthModule: ModuleProviderBase_Props | undefined = filteredModules.find(
      (x: any) => x.moduleName === 'wealth'
    );
    const wealthCore: any = wealthModule && (wealthModule.moduleCore as ModuleWealth);
    if (!wealthCore) return;

    const data = {
      self: { ...(wealthCore.data.self as ModuleWealthPersonCore_Props) },
      partner: { ...(wealthCore.data.partner as ModuleWealthPersonCore_Props) },
      connection: { ...(wealthCore.data.connection as ModuleWealthConnectionCore_Props) }
    };

    if (!data.self.use) data.self.use = {};
    if (!data.partner.use) data.partner.use = {};
    if (!data.connection.use) data.connection.use = { person: {}, partner: {} };

    if (activeCol === 1) {
      data.self.use[wealthId] = wealthData.personUse;
      data.connection.use.person[wealthId] = wealthData.connectionUse;
    } else {
      data.partner.use[wealthId] = wealthData.personUse;
      data.connection.use.partner[wealthId] = wealthData.connectionUse;
    }

    const results = wealthCore.process(data.self, data.partner, data.connection, state);
    dispatchModule(dispatch, state, 'wealth', [data.self, data.partner, data.connection], results);
    setWealthEditorOpen(false);
  };

  const onPensionPrivateApprove = () => {
    const module = filteredModules.find((x:any) => x.moduleName === 'pensionPrivate');
    const core = module && (module.moduleCore as ModulePensionPrivate);
    if(!core) return;
    const data = {
      self: { ...(core.data.self as ModulePensionPrivateData)},
      partner: { ...(core.data.partner as ModulePensionPrivateData)},
      connection: { ...(core.data.connection)},
    }
    const useData = activeCol === 1 ? data.self : data.partner;
    pensionPrivateData.forEach((pseudoCard:any) => {
      const targetCard = useData.array && useData.array.find((x:any) => x.id === pseudoCard.id);
      if(!targetCard) return false;
      if(pseudoCard.disc === 'cap'){
        targetCard.capitalUse = pseudoCard.use;
      }
      else if(pseudoCard.disc === 'dis'){
        const targetElem = targetCard.disability && targetCard.disability.find((x:any)=> x.id === pseudoCard.subId);
        if(!targetElem) return false;
        targetElem.use = pseudoCard.use;
      }
      else if(pseudoCard.disc === 'left'){
        const targetElem = targetCard.leftBehind && targetCard.leftBehind.find((x:any)=> x.id === pseudoCard.subId);
        if(!targetElem) return false;
        targetElem.use = pseudoCard.use;
      }
    });
    const results = core.process(data.self,data.partner,data.connection,state);
    dispatchModule(dispatch,state,'pensionPrivate',[data.self,data.partner,data.connection], results);
    setPensionPrivateEditorOpen(false);
  }

  return diagramData && 
  diagramData.need && 
  diagramData.income && 
  diagramData.steps.length ? (
    <>
      <AnalyzerHolder>
        <Heading2>{t(`diagramHeading`) + ` ${names[activeCol - 1]}`}</Heading2>
        <AnalyzerDiagram
          t={t}
          diagramData={diagramData}
          openNeedEditor={openNeedEditor}
          openWealthEditor={openWealthEditor}
          openPensionPrivateEditor={openPensionPrivateEditor}
          wealthData={wealthData}
          pensionPrivateData={pensionPrivateData}
        />
      </AnalyzerHolder>

      <NeedsEditor
        isOpen={isNeedEditorOpen}
        setOpen={() => {
          setNeedEditorOpen(open => !open);
          updateNeedEditorData();
        }}
        data={needData}
        mode={mode}
        gender={activeCol === 1 ? state.myPerson.gender[0] : state.myPartner.gender[0]}
        onEditorApprove={onNeedApprove}
        toggleHelp={toggleHelp}
        t={t}
        setData={setNeedData}
        firstName={names[activeCol - 1]}
      />

      <WealthEditor
        isOpen={isWealthEditorOpen}
        setOpen={() => {
          setWealthEditorOpen(open => !open);
          updateWealthEditorData();
        }}
        data={wealthData}
        mode={mode}
        activeCol={activeCol}
        onEditorApprove={onWealthApprove}
        toggleHelp={toggleHelp}
        t={t}
        setData={setWealthData}
        firstName={names[activeCol - 1]}
      />

      <PensionPrivateEditor
        isOpen={isPensionPrivateEditorOpen}
        setOpen={() => {
          setPensionPrivateEditorOpen(open => !open);
          updatePensionPrivateEditorData();
        }}
        data={pensionPrivateData}
        mode={mode}
        activeCol={activeCol}
        onEditorApprove={onPensionPrivateApprove}
        toggleHelp={toggleHelp}
        t={t}
        setData={setPensionPrivateData}
        firstName={names[activeCol - 1]}
      />

      <CardRecommend t={t} data={diagramData} mode={mode} />
      <CardSuggestion
        t={t}
        mode={mode}
        openNeedsEditor={() => setNeedEditorOpen(true)}
        history={history}
        state={state}
      />
    </>
  ) : (
    <CardWarning t={t} />
  );
};

export default Analyzer;
