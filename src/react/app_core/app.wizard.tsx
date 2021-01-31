import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux';

import {
  AvatarPerson,
  AvatarConnection,
  StyledWizard,
  WizardControl,
  WizardToolbar,
  WizardHeading,
  ButtonRedirect
} from './app.styled';
import { Wizard_Props, Avatar_Props } from './app.interfaces';
import { Row, Wrapper } from '../components/common/styled';
import avatarDefaultPerson from '../assets/images/avatar.png';
import avatarDefaultPartner from '../assets/images/avatar_partner.png';
import authService from '../services/authService';
import { Dossier } from '../redux/initialState';

const Wizard: React.FC<Wizard_Props> = ({
  modules,
  titles,
  activeModule,
  setActiveModule,
  moduleType,
  t,
  isMobile,
  validModules,
  activeCol,
  setActiveCol,
  ...props
}) => {
  const [lastItem, setLastItem] = useState(0);
  const [lastPartnerState, setLastPartnerState] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const state = useStore().getState();

  const moduleId = modules.findIndex((m) => m === activeModule);

  useEffect(() => {
    if (lastItem > moduleId) {
      setAnimationClass('slide-around-right-animate');
      setTimeout(() => {
        setAnimationClass('');
      }, 500);
      setLastItem(moduleId);
    } else if (lastItem < moduleId) {
      setTimeout(() => {
        setAnimationClass('');
      }, 500);
      setAnimationClass('slide-around-left-animate');
      setLastItem(moduleId);
    } else {
      //setAnimationClass('');
    }
  }, [activeModule, lastItem, moduleId]);

  useEffect(() => {
    if (isMobile === false && lastPartnerState !== (state && state.myPartner && state.myPartner.active)) {
      setLastPartnerState(state && state.myPartner && state.myPartner.active);
      if (state && state.myPartner && state.myPartner.active) {
        setAnimationClass('slide-left-animate');
        setTimeout(() => {
          setAnimationClass('');
        }, 500);
      } else {
        setAnimationClass('slide-right-animate');
        setTimeout(() => {
          setAnimationClass('');
        }, 500);
      }
    }
  }, [isMobile, lastPartnerState, state]);

  return (
    <>
      <WizardToolbar>
        {modules.length > 1 &&
          modules.map((modName: string, i: number) => {
            return (
              <WizardControl
                key={i}
                state={validModules[modName]}
                active={modName === activeModule}
                onClick={() => {
                  authService.syncDossier('save');
                  return setActiveModule(modName);
                }}
              />
            );
          })}
      </WizardToolbar>
      <div style={{ overflowX: 'hidden' }}>
        <div className={animationClass}>
          <WizardHeading>{titles[modules.indexOf(activeModule)]}</WizardHeading>
          <Wrapper width={1300} formOffset>
            {activeModule !== 'quickCheckForm' ? (
              <Avatar
                t={t}
                isMobile={isMobile}
                moduleType={moduleType}
                activeCol={activeCol}
                setActiveCol={setActiveCol}
              />
            ) : (
              ''
            )}
            <Row>
              <StyledWizard>
                {props.children.map((item: any, i: number) => (
                  <Step key={i} activeModule={activeModule} moduleName={modules[i]}>
                    {!item.props ? item : item.props.children ? item.props.children : item}
                  </Step>
                ))}
              </StyledWizard>{' '}
            </Row>
          </Wrapper>
        </div>
      </div>
    </>
  );
};

export const Step = (props: any) => {
  if (props.activeModule !== props.moduleName) {
    return null;
  }

  return props.children;
};

export const Avatar: React.FC<Avatar_Props> = ({ isMobile, moduleType, activeCol, t, setActiveCol }) => {
  const state: Dossier = useStore().getState();
  const useAsMenu = (state.myPartner.active && isMobile) || moduleType === 'analyzer';

  return (
    <Row style={{ justifyContent: 'space-around', alignItems: 'center' }}>
      <AvatarPerson useAsMenu={useAsMenu} active={activeCol === 1} className={'self'} partner={state.myPartner.active}>
        <div>
          <img
            src={state.myPerson.image || avatarDefaultPerson}
            onClick={() => {
              setActiveCol(1);
            }}
            alt="Avatar User"
          />
        </div>
      </AvatarPerson>
      {state.myPartner && state.myPartner.active && (
        <>
          <AvatarConnection mode={state.myConnection && state.myConnection.mode}>
            <ButtonRedirect
              active={moduleType === 'analyzer'}
              position={activeCol !== 1 ? 'left' : 'right'}
              onClick={() => setActiveCol(activeCol !== 1 ? 1 : 2)}
            >
              {t('global:showResult', { name: activeCol === 1 ? state.myPartner.firstName : state.myPerson.firstName })}
            </ButtonRedirect>
          </AvatarConnection>
          <AvatarPerson useAsMenu={useAsMenu} active={activeCol === 2}>
            <div>
              <img
                src={state.myPartner.image || avatarDefaultPartner}
                onClick={() => {
                  setActiveCol(2);
                }}
                alt="Avatar Partner"
              />
            </div>
          </AvatarPerson>
        </>
      )}
    </Row>
  );
};

export default Wizard;
