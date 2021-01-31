import React, { useState, useEffect } from 'react';
import { connect, useStore } from 'react-redux';
import { Row, Col, Page, Section, Separator, Icon } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { TabsComponent, TabsContainer, TabContent } from '../../../components/common/tabs';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import {
  setLogin,
  changeMyPartner,
  changeMyPerson,
  changeMyConnection,
  changeMyPartnerState,
  changeAccount,
  updateSyncTimestamp,
  setApplications,
  changeSpecialist
} from '../../../redux/actions';
import authService, { LoginResponse } from '../../../services/authService';
import queryString from 'query-string';
import { LoginTab } from '../components/loginTab';
import { FirstRegisterStepTab } from '../components/firstRegisterStepTab';
import { SecondRegisterStepTab } from '../components/secondRegisterStepTab';
import { ApproveLoginCodeTab } from '../components/approveLoginCodeTab';
import { Tab } from '@material-ui/core';
import { useParams } from 'react-router';
import { Account } from '../../../redux/types';
import { Dossier } from '../../../redux/initialState';
import notificationService from '../../../services/notificationService';
import dossierProvider from '../../../providers/dossierProvider';

const mapDispatchToProps = (dispatch: any) => {
  return {
    setLogin: (isLoggedIn: boolean) => dispatch(setLogin(isLoggedIn)),
    changeMyPerson: (x: any) => dispatch(changeMyPerson(x)),
    changeMyPartner: (x: any) => dispatch(changeMyPartner(x)),
    changeMyPartnerState: () => dispatch(changeMyPartnerState()),
    changeMyConnection: (x: any) => dispatch(changeMyConnection(x)),
    setApplications: (x: any) => dispatch(setApplications(x)),
    changeMyAccount: (x: any) => dispatch(changeAccount(x)),
    changeSpecialist: (x: any) => dispatch(changeSpecialist(x)),
    updateSyncTimestamp: (x: number) => dispatch(updateSyncTimestamp(x))
  };
};

type LoginPageProps = {
  setLogin: (isLoggedIn: boolean) => void;
  changeMyPerson: (x: any) => void;
  changeMyPartner: (x: any) => void;
  changeMyPartnerState: () => void;
  setApplications: (x: any) => void;
  changeMyAccount: (x: any) => void;
  changeSpecialist: (x: any) => void;
  changeMyConnection: (x: any) => void;
  updateSyncTimestamp: (x: number) => void;
} & RouteComponentProps<{}>;

const LoginPage = (props: LoginPageProps) => {
  const { t } = useTranslation('login');
  let { referrerCode, promotionCode } = useParams<any>();
  const [code, setCode] = useState<string>('');
  const [unlocker, setUnlocker] = useState<string>('');
  const { location } = props;
  const [session, setSession] = useState<string>('');
  const [mode, setMode] = useState<string>('');
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const store = useStore();
  useEffect(() => {
    const params: any = queryString.parse(location.search);
    if (params.code && params.unlocker) {
      setActiveTab('registration');
      setCode(params.code);
      setUnlocker(params.unlocker);
    }
  }, [location.search]);

  useEffect(() => {
    if (
      location &&
      location.search &&
      location.search.indexOf('unlocker') > -1 &&
      location.search.indexOf('code') > -1
    ) {
      const params: any = queryString.parse(location.search);
      setActiveTab('registration');
      setCode(params.code);
      setUnlocker(params.unlocker);
    } else if (location.pathname.match(`${t('routes:register')}`)) {
      setActiveTab('registerTab');
    } else if (location.pathname.match(`${t('routes:login')}`)) {
      setActiveTab('loginTab');
    }
  }, [location, t]);

  const [activeTab, setActiveTab] = useState<string>('loginTab');

  useEffect(() => {
    setDisabled(false);
  }, [activeTab]);

  const setDossierAndAccount = (x: Account) => {
    dossierProvider.getDossierInfo(
      (res: Dossier, own_dossier: boolean) => {
        props.changeMyAccount({ ...x, ownDossier: own_dossier });
        if (res) {
          if (res.myPerson) {
            props.changeMyPerson(res.myPerson);
          }
          if (res.myPartner) {
            props.changeMyPartner(res.myPartner);
            if (res.myPartner.active && res.myPerson.hasPartner.indexOf(1) > -1) props.changeMyPartnerState();
          }
          if (res.myConnection) {
            props.changeMyConnection(res.myConnection);
          }
          if (res.specialist) {
            props.changeSpecialist(res.specialist);
          }
        }
        setApplications(store.getState());
        props.setLogin(true);
        if (props.history.location.pathname.indexOf('/scan') < 0) {
          props.updateSyncTimestamp(res.sync.timestamp);
        }
        props.history.push('/');
      },
      (err: any) => {
        if (err === 'DossierNotFoundPro' || err === 'ProDossier') authService.redirectToProMode();
      }
    );
  };

  const loginCallback = (x: Account | LoginResponse) => {
    setDisabled(false);
    if ((x as LoginResponse).factors > 1) {
      setActiveTab('confirmCode');
      setSession((x as LoginResponse).sid || '');
      setMode((x as LoginResponse).mode || '');
    } else if (x as Account) {
      if ((x as LoginResponse).mode === 'pro') {
        authService.redirectToProMode();
      }
      setDossierAndAccount(x as Account);
      setApplications(store.getState());
    }
  };

  const login2faCallback = (x: Account) => {
    setDisabled(false);
    if (mode === 'pro') {
      authService.redirectToProMode();
    } else if (x) {
      setDossierAndAccount(x as Account);
      setApplications(store.getState());
    }
  };

  const errorCallback = (x: string) => {
    setDisabled(false);

    if (x === 'DossierNotFoundPro' || x === 'ProDossier') {
      authService.redirectToProMode();
    } else if (
      x === 'UsernameAlreadyExists' ||
      x === 'checkEmail' ||
      x === 'correctMistakes' ||
      x === 'UnknownUser' ||
      x === 'emptyFields' ||
      x === 'Unlocker' ||
      x === 'AccountAlreadyActivated' ||
      x === 'registrationSuccess' ||
      x === 'password' ||
      x === 'InvalidAccount' ||
      x === 'InvalidCode' ||
      x === 'useProMode'
    )
      notificationService.showErrorMessage(t(`notifications.${x}`));
    else notificationService.showErrorMessage(x);
  };

  return (
    <Page color="#303435" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <Section background="grey0" minHeight={'15vh'} minHeightTablet={'auto'}>
        <Row noMargin>
          <Col layout={1} force align="right">
            <Link to="/">
              <Icon
                style={{ padding: 0, margin: 0, cursor: 'pointer', float: 'right' }}
                size="55"
                content="close"
                cursor="pointer"
              />
            </Link>
          </Col>
        </Row>
      </Section>
      <Section background="grey0" style={{ textAlign: 'center' }}>
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 2} align="center">
            <Row>
              <Col layout={1}>
                <TabsComponent
                  defaultTab={activeTab}
                  onChanged={(val) => {
                    setActiveTab(val);
                  }}
                >
                  {activeTab !== 'confirmCode' ? (
                    [
                      <Tab key="1" value="loginTab" label={t(`loginTabHeader`)}></Tab>,
                      <Tab
                        key="2"
                        value={code && unlocker ? 'registration' : 'registerTab'}
                        label={t(`registerTabHeader`)}
                      ></Tab>
                    ]
                  ) : (
                    <Tab key="1" value="confirmCode" label={t(`confirmCodeTabHeader`)}></Tab>
                  )}
                </TabsComponent>
              </Col>
            </Row>
          </Col>
          <Col layout={1 / 4} />
        </Row>
        <Separator />
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 4} />
          <Col layout={1 / 2} align="center">
            <TabsContainer activeTabId={activeTab}>
              <TabContent id="loginTab">
                <LoginTab
                  disabled={isDisabled}
                  setDisabled={(x: boolean) => setDisabled(x)}
                  t={t}
                  location={location}
                  loginCallback={loginCallback}
                  error={errorCallback}
                />
              </TabContent>
              <TabContent id="registerTab">
                <FirstRegisterStepTab
                  disabled={isDisabled}
                  setDisabled={(x: boolean) => setDisabled(x)}
                  t={t}
                  referrerCode={referrerCode}
                  promotionCode={promotionCode}
                  error={errorCallback}
                />
              </TabContent>
              <TabContent id="registration">
                <SecondRegisterStepTab
                  t={t}
                  disabled={isDisabled}
                  code={code}
                  setDisabled={(x: boolean) => setDisabled(x)}
                  unlocker={unlocker}
                  loginCallback={loginCallback}
                  error={errorCallback}
                />
              </TabContent>
              <TabContent id="confirmCode">
                <ApproveLoginCodeTab
                  t={t}
                  disabled={isDisabled}
                  session={session}
                  setDisabled={(x: boolean) => setDisabled(x)}
                  callback={login2faCallback}
                  error={errorCallback}
                />
              </TabContent>
            </TabsContainer>
          </Col>
        </Row>
      </Section>
    </Page>
  );
};

export default connect(null, mapDispatchToProps)(withRouter(LoginPage));
