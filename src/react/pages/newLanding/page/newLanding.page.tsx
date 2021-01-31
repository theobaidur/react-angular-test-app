import React, { useState } from 'react';
import { Page, PrimaryButton, Heading1, GeneralText } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import CookieConsent from 'react-cookie-consent';
import { useParams } from 'react-router';

import {
  SlideContent,
  SlideLeft,
  SlideRightContent,
  SlideRight,
  MonetoLabel,
  MonetoLogo,
  StyledMonetoLogoContainer,
  FlexColumnContainer,
  FlexRowContainer,
  ImageLanding,
  MobileView
} from './newLanding.styled';
import VideoButton from '../../../components/common/videoButton';
import SliderComponent from '../components/slider';
import monetoVideo from '../../../assets/videos/Was-ist-Moneto.mp4';
import VideoPlayer from '../../../components/common/videoPlayer';

import img1 from '../../../assets/images/lp_pic1.png';
import img2 from '../../../assets/images/lp_pic2.png';
import img3 from '../../../assets/images/lp_pic3.png';
import bg1 from '../../../assets/images/slider1.jpg';
import bg2 from '../../../assets/images/slider2.jpg';
import bg3 from '../../../assets/images/slider3.jpg';
import bg4 from '../../../assets/images/slider4.jpg';
import useEffectOnlyOnce from '../../../utils/useEffectOnlyOnce';

let backgrounds: any = {
  first: bg1,
  second: bg2,
  third: bg3,
  fourth: bg4
};

let icons: any = {
  second: img1,
  third: img2,
  fourth: img3
};

interface Landing_Props {
  history: any;
}

const NewLandingPage: React.FC<Landing_Props> = ({ history }) => {
  const { t } = useTranslation(['landingMoneto', 'routes']);
  const [isOpen, setOpen] = useState<boolean>(false);
  let { referralIdentifier } = useParams<any>();

  const featureItems: Array<any> = t('features', { returnObjects: true });
  const isGAActive: boolean = window.location.host === 'www.moneto.ch';

  useEffectOnlyOnce(() => {
    const getCookie = (name: string) => {
      return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
      }, '');
    };
    if (getCookie('CookieConsent') === 'true') {
      onConfirmCookies();
    } else if (getCookie('CookieConsent') === 'false') {
      onDeclineCookies();
    }
  });

  useEffectOnlyOnce(() => {
    if (referralIdentifier) {
      window.sessionStorage.setItem('referralIdentifier', referralIdentifier);
    }
  });

  const onConfirmCookies = () => {
    sendAnonimized();
  };

  const onDeclineCookies = () => {
    sendAnonimized();
  };

  const sendAnonimized = () => {
    if (isGAActive) {
      ReactGA.initialize('UA-158770891-1');
    } else {
      ReactGA.initialize('testMode', { testMode: true });
    }

    ReactGA.set({ anonymizeIp: true });
    ReactGA.pageview(window.location.href);

    if (!isGAActive) {
      console.log('GA Test Mode Calls', ReactGA.testModeAPI.calls);
    }
  };

  return (
    <Page color={'#efefef'} paddingBottom={0} className={'contentPage'}>
      <CookieConsent
        enableDeclineButton
        acceptOnScroll={false}
        debug={false}
        buttonText={t('routes:allowCookiesButton')}
        buttonStyle={{ backgroundColor: 'rgb(229, 232, 234)', borderRadius: '5em', padding: '8px 35px' }}
        declineButtonStyle={{ backgroundColor: 'transparent', borderRadius: '5em', padding: '8px 0px' }}
        declineButtonText={t('routes:declineCookiesButton')}
        cookieName={'CookieConsent'}
        onAccept={({ acceptedByScrolling }) => {
          onConfirmCookies();
        }}
        onDecline={() => {
          onDeclineCookies();
        }}
      >
        {t('routes:cookieMessage')}
      </CookieConsent>

      <VideoPlayer isOpen={isOpen} toggle={() => setOpen((open: boolean) => !open)} src={monetoVideo}></VideoPlayer>
      <SliderComponent>
        {featureItems.length > 0 &&
          featureItems.map((item: any, index: number) => (
            <Slide
              key={index}
              t={t}
              title={item.title}
              description={item.description}
              redirect={() => history.push(t('routes:register'))}
              img={icons[item.img]}
              bgImg={backgrounds[item.background]}
              setOpen={(res: boolean) => setOpen(res)}
            />
          ))}
      </SliderComponent>
      <MobileView>
        <StyledSlideRightContent t={t} />
      </MobileView>
    </Page>
  );
};

interface Slide_Props {
  title: string;
  description?: string;
  setOpen: (x: boolean) => void;
  bgImg: string;
  img?: string;
  redirect: () => void;
  t: any;
}

export const Slide: React.FC<Slide_Props> = ({ title, description, setOpen, bgImg, img, redirect, t }) => (
  <SlideContent bgImg={bgImg}>
    <SlideLeft>
      <FlexRowContainer className="top-container">
        <MonetoLogoContainer />
        <VideoButton
          format="circle"
          firstText={t('videoButtonText')}
          secondText={t('videoButtonQuestion')}
          onClick={() => setOpen(true)}
        />
      </FlexRowContainer>
      <FlexRowContainer className="margin">
        <FlexColumnContainer className="content">
          <FlexColumnContainer>
            <Heading1 size="48" bold color="white0">
              {title}
            </Heading1>
            {description && (
              <GeneralText noMargin color="white0">
                {description}
              </GeneralText>
            )}
            <FlexColumnContainer className="button">
              <GeneralText noMargin color="white0">
                {t('registerLabel')}
              </GeneralText>
              <PrimaryButton onClick={redirect} main>
                {t('register')}
              </PrimaryButton>
            </FlexColumnContainer>
          </FlexColumnContainer>
        </FlexColumnContainer>
        {img && <ImageLanding src={img} />}
      </FlexRowContainer>
    </SlideLeft>
    <SlideRight>
      <StyledSlideRightContent t={t} />
    </SlideRight>
  </SlideContent>
);

export const StyledSlideRightContent: React.FC<{ t: any }> = ({ t }) => (
  <SlideRightContent>
    <FlexColumnContainer className="description">
      <Heading1 size="24" noMargin color="white0">
        {t('rightSideTitile')}
      </Heading1>
      <GeneralText color="white0">{t('rightSideDescription')}</GeneralText>
    </FlexColumnContainer>
    <FlexColumnContainer>
      {/* <ImgContainer index="0" src={pax} />
      <ImgContainer index="1" src={pax} />
      <ImgContainer index="2" src={pax} /> */}
    </FlexColumnContainer>
  </SlideRightContent>
);

export const MonetoLogoContainer = () => (
  <StyledMonetoLogoContainer>
    <MonetoLogo />
    <MonetoLabel />
  </StyledMonetoLogoContainer>
);
export default NewLandingPage;
