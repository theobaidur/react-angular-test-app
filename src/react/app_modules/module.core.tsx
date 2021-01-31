import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useStore } from 'react-redux';

import {
  ModuleProvider_Props,
  ModuleHelp_Props,
  ModuleCol_Props,
  CardFilter_Props,
  CardData_Props,
  Card_Props,
  FieldValuePair,
  ValidCard_Props
} from '../inc/module.interfaces';
import { StyledModuleCol, ModuleHolder } from './module.styled';
import PortalComponent from '../components/common/portal';
import DrawerComponent from '../components/common/drawer';
import DrawerContent from '../components/common/drawerContent';
import { dispatchModule } from '../redux/dispatcher';
import { useWindowSize } from '../utils/handleWindowResizeHook';
import { Person, MyConnection } from '../redux/types';
import { useMemoizedCallback } from '../utils/customCallbackHook';
import { KFormCardArray } from '../components/KForm';

const ModuleProvider: React.FC<ModuleProvider_Props> = ({
  moduleName,
  moduleCore,
  mode,
  cardFilter,

  validateModule,
  validState,
  toggleHelp,
  activeCol
}) => {
  const { t } = useTranslation(['module_' + moduleName, 'modules']);
  const isMobile: boolean = useWindowSize();
  const dispatch = useDispatch();
  const store = useStore();
  const state = useStore().getState();
  // for saving module changes in the end of lifecycle
  // const ref: any = React.useRef();
  const [count, setCount] = useState<number>(0);
  const [validCards, setValidCards] = useState<ValidCard_Props>({});

  const validateCard = useCallback(
    (id: string, valid: boolean) => {
      setValidCards((item:ValidCard_Props) => ({ ...item, [id]: valid }));
    },
    [setValidCards]
  );

  const handleApprove = useCallback(
    (x: boolean) => {
      setCount((count: number) => count + (x === true ? 1 : -1));
    },
    [setCount]
  );

  const [myPersonData, setMyPersonData] = useState<{ [key: string]: any }>(
    moduleName !== 'profile' && moduleName !== 'children' && state.myPerson.legal
      ? { ...state.myPerson.legal[moduleName] }
      : { ...state.myPerson }
  );
  const [myPartnerData, setMyPartnerData] = useState<{ [key: string]: any }>(
    moduleName !== 'profile' && moduleName !== 'children' && state.myPerson.legal
      ? { ...state.myPartner.legal[moduleName] }
      : { ...state.myPartner }
  );
  const [myConnectionData, setMyConnectionData] = useState<{ [key: string]: any }>(
    moduleName !== 'profile' && moduleName !== 'children' && state.myPerson.legal
      ? { ...state.myConnection.legal[moduleName] }
      : { ...state.myConnection }
  );

  const setModuleData: Function[] = [setMyPersonData, setMyPartnerData, setMyConnectionData];

  const selectedModuleView = moduleCore && moduleCore.views && moduleCore.views.find((x) => x.mode === mode);
  const ModuleView: React.FC<{ result: any }> | undefined = selectedModuleView && selectedModuleView.component;
  const conCardFilter: CardFilter_Props | undefined = cardFilter && cardFilter[2] ? cardFilter[2] : undefined;
  let cardCounter = 0;

  const setFieldValue = (target: number, name: string, value: any) => {
    if (name === 'hasPartner') {
      setModuleData[1](() => new Person(value.indexOf(1) > -1));
      setModuleData[2](() => new MyConnection());
    }
    setModuleData[target]((data: { [key: string]: any }) => ({ ...data, [name]: value }));
  };

  const setFieldValues = (target: number, fieldValues: FieldValuePair[]) => {
    if (fieldValues && Array.isArray(fieldValues)) {
      let newFields: { [key: string]: any } = {};
      fieldValues.forEach((field) => {
        if (field.name === 'hasPartner') {
          throw new Error("Setting 'hasPartner' via setFieldValues is not supported. Use setFieldValue instead.");
        }
        newFields = { ...newFields, [field.name]: field.value };
      });
      setModuleData[target]((data: { [key: string]: any }) => ({ ...data, ...newFields }));
    }
  };

  useEffect(() => {
    const moduleData: any[] = [myPersonData, myPartnerData, myConnectionData];
    //change redux state with every change in an input
    if (moduleCore) {
      let data: any = moduleCore.process(myPersonData, myPartnerData, myConnectionData, store.getState());
      dispatchModule(dispatch, store.getState(), moduleName, moduleData, data);
      // ref.current = moduleData;
    }
  }, [myPersonData, myPartnerData, myConnectionData, dispatch, moduleCore, moduleName, store]);

  //useEffect for saving all data when module is closed
  // useEffect(() => {
  //   return () => {
  //     if (moduleCore) {
  //       let data: any = moduleCore.process(ref.current[0], ref.current[1], ref.current[2], state);
  //       dispatchModule(dispatch, state, moduleName, ref.current, data);
  //     }
  //   };
  // }, []);

  const runCardValidator = useMemoizedCallback(() => {
    moduleCore && moduleCore.process(myPersonData, myPartnerData, myConnectionData, store.getState());
    let validToken = Object.keys(validCards).length > 0 ? 2 : 0;
    for (var k in validCards) {
      if (!validCards[k]) validToken = 1;
    }

    validateModule(moduleName, validToken);
  }, [validCards, moduleCore, moduleName, myConnectionData, myPartnerData, myPersonData, store, validateModule]);

  useEffect(() => {
    runCardValidator();
  }, [validCards, runCardValidator]);

  return (
    <>
      {ModuleView ? <ModuleView result={moduleCore && moduleCore.result} /> : ''}

      {state.myPartner.active && conCardFilter && ((activeCol === 1 && isMobile) || !isMobile) && (
        <ModuleHolder>
          <ModuleCol
            name={conCardFilter.name}
            target={conCardFilter.person}
            colNumber={0}
            activeCol={activeCol}
            partner={state.myPartner.active}
            isExtended={true}
          >
            {conCardFilter.content.map((card: CardData_Props, i: number) => {
              const chosenCardData = moduleCore && moduleCore.cards.find((x: CardData_Props) => x.name === card.name);

              if (chosenCardData && chosenCardData.classed) {
                const ChosenCard: React.FunctionComponent<Card_Props> = chosenCardData.classed.card;
                const cardId: string = conCardFilter.person + '_' + card.name;
                cardCounter++;
                if( moduleCore && moduleCore.layout === 'array' ){
                    return (
                      <KFormCardArray
                        key={i}
                        CardSample={ChosenCard}
                        validCards={validCards}
                        refObj={chosenCardData.refObj}
                        id={cardId}
                        cardName={card.name}
                        mode={mode}
                        legalData={myConnectionData}
                        setFieldValue={(name: string, value: any) => setFieldValue(2, name, value)}
                        setFieldValues={(fieldValues: FieldValuePair[]) => setFieldValues(2, fieldValues)}

                        t={t}
                        target={conCardFilter.person}
                        cardNumber={cardCounter}
                        handleApprove={handleApprove}
                        position={'left'}
                        toggleHelp={toggleHelp}
                        validateCard={validateCard}
                        validate={chosenCardData.classed.validate}
                      />
                    );
                }
                else if( moduleCore && moduleCore.layout === 'static' ){
                  return (
                    <ChosenCard
                      id={cardId}
                      cardName={card.name}
                      mode={mode}
                      key={i}
                      legalData={myConnectionData}
                      t={t}
                      target={conCardFilter.person}
                      cardNumber={cardCounter}
                      isCardValid={validCards[cardId]}
                      handleApprove={handleApprove}
                      position={'left'}
                      setFieldValue={(name: string, value: any) => setFieldValue(2, name, value)}
                      setFieldValues={(fieldValues: FieldValuePair[]) => setFieldValues(2, fieldValues)}
                      toggleHelp={toggleHelp}
                      validateCard={validateCard}
                      validate={chosenCardData.classed.validate}
                    />
                  );
                }else{}
              }
              return undefined;
            })}
          </ModuleCol>
        </ModuleHolder>
      )}

      <ModuleHolder>
        {cardFilter &&
          cardFilter.map((filter: CardFilter_Props, n: number) => {
            if (
              n === 2 ||
              (n === 1 && (!state.myPartner.active || filter.isHidden)) ||
              (isMobile && n + 1 !== activeCol)
            ) {
              return false;
            }

            return (
              <ModuleCol
                key={n}
                name={filter.name}
                target={filter.person}
                colNumber={n + 1}
                activeCol={activeCol}
                partner={state.myPartner.active}
                isExtended={filter.isExtended}
              >
                {filter.content.map((card: CardData_Props, i: number) => {
                  const chosenCardData =
                    moduleCore && moduleCore.cards.find((x: CardData_Props) => x.name === card.name);
                  if (chosenCardData && chosenCardData.classed) {
                    const ChosenCard: React.FunctionComponent<Card_Props> = chosenCardData.classed.card,
                      cardId: string = filter.person + '_' + card.name,
                      useData: any = chosenCardData.connection
                        ? myConnectionData
                        : n === 0
                        ? myPersonData
                        : myPartnerData;
                        cardCounter++;
                    if( moduleCore && moduleCore.layout === 'array' ){
                      return (
                        <KFormCardArray
                          key={i}
                          CardSample={ChosenCard}
                          validCards={validCards}

                          id={cardId}
                          cardName={card.name}
                          mode={mode}
                          legalData={useData}
                          setFieldValue={(name: string, value: any) => setFieldValue(chosenCardData.connection ? 2 : n, name, value)}
                          setFieldValues={(fieldValues: FieldValuePair[]) => setFieldValues(chosenCardData.connection ? 2 : n, fieldValues)}

                          t={t}
                          target={filter.person}
                          cardNumber={cardCounter}
                          handleApprove={handleApprove}
                          position={n === 0 ? 'left' : 'right'}
                          toggleHelp={toggleHelp}
                          validateCard={validateCard}
                          validate={chosenCardData.classed.validate}
                        />
                      );
                    }
                    else if( moduleCore && moduleCore.layout === 'static' ){
                      return (
                        <ChosenCard
                          id={cardId}
                          cardName={card.name}
                          mode={mode}
                          key={i}
                          legalData={useData}
                          t={t}
                          disabled={cardCounter - 1 > count || validCards[cardId] === undefined}
                          target={filter.person}
                          cardNumber={cardCounter}
                          isCardValid={validCards[cardId]}
                          handleApprove={handleApprove}
                          position={n === 0 ? 'left' : 'right'}
                          setFieldValue={(name: string, value: any) =>
                            setFieldValue(chosenCardData.connection ? 2 : n, name, value)
                          }
                          setFieldValues={(fieldValues: FieldValuePair[]) =>
                            setFieldValues(chosenCardData.connection ? 2 : n, fieldValues)
                          }
                          toggleHelp={toggleHelp}
                          validateCard={validateCard}
                          validate={chosenCardData.classed.validate}
                        />
                      );
                    }
                  }
                  return undefined;
                })}
              </ModuleCol>
            );
          })}
      </ModuleHolder>
    </>
  );
};

export default ModuleProvider;

export const ModuleHelp: React.FC<ModuleHelp_Props> = ({ isOpen, activeHelp, history, toggleHelp, activeModule }) => {
  return (
    <PortalComponent isOpen={isOpen} toggle={toggleHelp}>
      <DrawerComponent position="right">
        <DrawerContent
          currentId={activeHelp}
          history={history}
          onClose={() => toggleHelp('')}
          activeModule={activeModule}
        />
      </DrawerComponent>
    </PortalComponent>
  );
};

export const ModuleCol: React.FC<ModuleCol_Props> = ({ activeCol, target, name, partner, isExtended, ...props }) => {
  return (
    <StyledModuleCol className={name} partner={partner} isExtended={isExtended}>
      {props.children}
    </StyledModuleCol>
  );
};
