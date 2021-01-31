import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Heading1,
  Page,
  Section,
  Heading3,
  IconButton,
  PrimaryButton,
  GeneralText
} from '../../../components/common/styled';
import { StyledDashboardPage } from './dashboard.styled';
import Application from '../components/application';
import DashboardMenu from '../components/menu';
import bgDashboard from '../../../assets/images/bg_dashboard.jpg';
import { routes } from './dashboardRoutes';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import News from '../components/news';
import FutureApplication from '../components/futureApplication';
import boat from '../assets/symb_Boat.svg';
import ahvPk from '../assets/symb_AHV-PK.svg';
import candle from '../assets/symb_Candle.svg';
import ivKtg from '../assets/symb_IV-KTG.svg';
import doctor from '../assets/symb_Doctor.svg';
import q from '../assets/symb_Q.svg';
import ConsultantPanel from '../../../components/common/consultantPanel';
//import { config } from '../../../config';
import ModalWindow from '../../../components/common/modalWindow';
import i18next from 'i18next';
import useEffectOnlyOnce from '../../../utils/useEffectOnlyOnce';
import { ConsultantAvatar } from '../../../components/common/consultantPanel/consultantPanel';

interface DashboardProps {
  history: any;
}

const DashboardPage: React.FC<DashboardProps> = ({ history }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isNewsPanelOpen, setNewsPanelOpen] = useState<boolean>(false);
  const [isConsultantPanelOpen, setConsultantPanelOpen] = useState<boolean>(false);
  const { t } = useTranslation('dashboard');

  const [isBrowserWarningOpen, setBrowserWarningOpen] = useState<boolean>(false);

  // Internet Explorer 6-11
  const doc = document as Document & { documentMode?: any };
  const isIE = /*@cc_on!@*/false || !!doc.documentMode;
  // Edge 20+
  //const win = window as Window & { StyleMedia?: any };
  //const isEdge = !isIE && !!win.StyleMedia;


  const { location } = history;
  const { t: tRoutes } = useTranslation('routes');
  useEffect(() => {
    const morePathName = tRoutes('more', { returnObjects: true });
    if (location.pathname.match(morePathName)) {
      setActiveTab(1);
    }
  }, [location.pathname, tRoutes]);

  useEffectOnlyOnce(()=>{
    if( isIE ){
      setBrowserWarningOpen( true );
   }
  });

  const images: {
    [x: string]: any;
  } = {
    ahvPk,
    boat,
    q,
    candle,
    ivKtg,
    doctor
  };
  const state = useStore().getState();
  const name = state.myPerson.fullName() || '';
  const toggleNewsPanel = () => setNewsPanelOpen((open: boolean) => !open);
  const toggleConsultantPanel = () => setConsultantPanelOpen((open: boolean) => !open);
  const menuItems: Array<any> = t('menuItems', { returnObjects: true });
  const menuItemTitles: Array<string> = menuItems.map((item: any) => item.menuName);


  return (
    <Page paddingBottom={70}>
    <BrowserWarning
      isOpen={isBrowserWarningOpen}
      onClose={() => setBrowserWarningOpen( false )}
      t={t}
    />
      <News isOpen={isNewsPanelOpen} toggle={toggleNewsPanel} />
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
      <Section img={bgDashboard}>
        <Row noMargin style={{ margin: '0 auto 20px' }}>
          <Col layoutS={1 / 2} layout={1 / 2} force>
            <IconButton content="notification" onClick={toggleNewsPanel}>
              {t('communicationButton')}
            </IconButton>
          </Col>
          <Col layoutS={1 / 2} layout={1 / 2} force align="right">
            {
            state.specialist && (state.specialist.state === 0 || state.specialist.state === 1) && (
              <ConsultantAvatar specialist={state.specialist} togglePanel={toggleConsultantPanel} t={t} />
           )
           }
          </Col>
        </Row>
        <Row noMargin>
          <Col layout={1 / 4} />
          <Col layout={1 / 2} align="center">
            <Heading1 color={'white0'} size={54} bold noMargin>
              {t('title')}
            </Heading1>
            <Heading3 color={'white0'} light noMargin>
              {(state.account.is_specialist === 1 ? t('dossierFor') + ' ' : '') + name}
            </Heading3>
          </Col>
          <Col layout={1 / 4} />
        </Row>
        <DashboardMenu activeTab={activeTab} onChange={setActiveTab} menuItems={menuItemTitles} />
      </Section>

      <StyledDashboardPage>
        <Row>
          <Col>
            <Heading1 size={36} light noMargin>
              {t(`menuItems.${activeTab}.fullName`)}
            </Heading1>
            <Heading3 light noMargin color={'blue1'}>
              {t(`menuItems.${activeTab}.description`)}
            </Heading3>
          </Col>
        </Row>
        <Row>
          <Col layout="1" className="app-container">
            {menuItems[activeTab].applications.map((item: any, index: number) => {
              return routes.length - 1 === activeTab ? (
                <FutureApplication
                  key={index}
                  title={item.name}
                  description={item.description}
                  iconName={item.iconName}
                  background={item.background}
                  color={item.color}
                />
              ) : (
                <Application
                  name={item.name}
                  key={index}
                  history={history}
                  description={item.description}
                  chart={images[item.chart]}
                  icon={images[item.logo]}
                  buttonText={item.buttonText}
                  progress={Math.round(state.authInfo.applications[item.linkName].progress)}
                  showProgress={true}
                  doneLabel={item.done}
                  link={item.url}
                />
              );
            })}
          </Col>
        </Row>
      </StyledDashboardPage>
    </Page>
  );
};

export default DashboardPage;

const BrowserWarning: React.FC<{
  isOpen: boolean; onClose: () => void; t:i18next.TFunction;
}> = ({
  isOpen, onClose, t
 }) => {
  return (
    <ModalWindow
    isOpen={isOpen}
    toggle={onClose}
    title={t(`browserWarning.title`) }
    width={500}
    color={'red1'}
    buttons={[
        <PrimaryButton outlined onClick={onClose} key="cancel">
        { t(`browserWarning.accept`) }
        </PrimaryButton>
    ]}
    >
    <GeneralText>
      {t(`browserWarning.text`) }
    </GeneralText>
        <a
          key={0}
          href="https://www.mozilla.org/de/firefox/new/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '20px', cursor: 'pointer' }}
        >Mozilla Firefox &gt;&gt;</a>
        <a
          key={1}
          href="https://www.google.com/intl/de/chrome/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '20px', cursor: 'pointer' }}
        >Google Chrome &gt;&gt;</a>
    </ModalWindow>
  );
}
