import React, { useEffect, useState, useMemo } from 'react';
import {
  AppIntroWrapper,
  BackgroundAppInfo,
  IconsWrapper,
  PartnersWrapper,
  LinearProgressStyled
} from './appIntro.styled';
import boat from '../../../pages/dashboard/assets/symb_Boat.svg';
import ahvPk from '../../../pages/dashboard/assets/symb_AHV-PK.svg';
import candle from '../../../pages/dashboard/assets/symb_Candle.svg';
import ivKtg from '../../../pages/dashboard/assets/symb_IV-KTG.svg';
import doctor from '../../../pages/dashboard/assets/symb_Doctor.svg';
import q from '../../../pages/dashboard/assets/symb_Q.svg';
import pax from '../../../assets/images/pax.png';
import { Heading1, Heading3 } from '../styled';
import PortalComponent from '../portal';
import { LinearProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface AppIntroComponent_Props {
  appName: string;
  chart: string;
  logo: string;
}

const AppIntroComponent: React.FC<AppIntroComponent_Props> = ({ appName }) => {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [application, setApplication] = useState<any>({});
  const [value, setValue] = useState<number>(0);
  const { t } = useTranslation('applications');
  const applications = useMemo( ()  => ([
    {
      key: 'pensionPlaning',
      appName: t('pensionPlaning'),
      chart: ahvPk,
      logo: boat
    },
    {
      key: 'disabilityPlaning',
      appName: t('disabilityPlaning'),
      chart: ivKtg,
      logo: doctor
    },
    {
      key: 'leftBehindPlaning',
      appName: t('leftBehindPlaning'),
      chart: q,
      logo: candle
    }
  ]), [t]);

  const duration = 3000;

  useEffect(() => {
      if (value < 100) {
        setTimeout(() => setValue((val: number) => val + 5), duration / 20);
      } else {
        setOpen(false);
      }
  },
    [value, setOpen]
  );

  useEffect(() => {
    setApplication(applications.find((x: any) => x.key === appName));
  }, [appName, applications]);

  return (
    <PortalComponent isOpen={isOpen} toggle={() => {}}>
      <AppIntroWrapper>
        <BackgroundAppInfo>
          <Heading1 noMargin bold size="36" color="white0">
            {application.appName}
          </Heading1>
          <Heading3 noMargin bold color="white0" style={{ margin: '10px 0 20px' }}>
            {t(`loading`)}
          </Heading3>
          <IconsWrapper>
            <img src={application.chart} alt="Logo img" />
            <img src={application.logo} alt="Chart img" />
          </IconsWrapper>
          <LinearProgressStyled>
            <LinearProgress variant="determinate" value={value} className="progress" />
          </LinearProgressStyled>
        </BackgroundAppInfo>
        <PartnersWrapper>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
          <img src={pax} alt=""></img>
        </PartnersWrapper>
      </AppIntroWrapper>
    </PortalComponent>
  );
};

export default AppIntroComponent;
