import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Link, Element } from 'react-scroll';
import queryString from 'query-string';

import {
  LogoutWrapper,
  Mountains,
  Hero,
  Moon,
  TextWrapper,
  PartnersWrapper,
  Content,
  ArrowButton,
  LaptopCotnainer
} from './logout.styled';
import { Page, Heading1, Heading3, GeneralText } from '../../../components/common/styled';
import dayBg from '../assets/sky_day_v01.jpg';
import eveningBg from '../assets/sky_evening_v01.jpg';
import nightBg from '../assets/sky_night_v01.jpg';
import morningBg from '../assets/sky_morning_v01.jpg';

import mountatinsDay from '../assets/mountains_day_lunchhour_v01.svg';
import mountatinsEvening from '../assets/mountains_evening_v01.svg';
import mountatinsMorning from '../assets/mountains_morning_v01.svg';
import mountatinsNight from '../assets/mountains_night_v01.svg';

import monetoHero from '../assets/moneto_hero_v01.svg';
import moon from '../assets/moon_v01.svg';
import pax from '../../../assets/images/pax.png';

const screens: any = {
  morning: {
    bg: morningBg,
    mountains: mountatinsMorning,
    position: 'left'
  },
  lunch: {
    bg: dayBg,
    mountains: mountatinsDay
  },
  day: {
    bg: dayBg,
    mountains: mountatinsDay
  },
  evening: {
    bg: eveningBg,
    mountains: mountatinsEvening,
    position: 'right'
  },
  night: { bg: nightBg, mountains: mountatinsNight, position: 'top' }
};

export const LogoutPage: React.FC<any> = ({ history }) => {
  console.log('test', history);
  const [current, setCurrent] = useState<string>('morning');
  const [firstName, setFirstName] = useState<string>('Benutzer');
  const [secondName, setSecondName] = useState<string>('');
  const { t } = useTranslation('logout');

  useEffect(() => {
    const value: any = queryString.parseUrl(history.location.search);
    setFirstName(value.query.firstName);
    if (value.query.secondName) setSecondName(value.query.secondName);
  }, [history.location]);

  useEffect(() => {
    const dateDiff = (h1: number, m1: number, h2: number, m2: number) => {
      return h1 * 60 + m1 - h2 * 60 - m2;
    };

    const detectTimeOfDay = () => {
      const hour: number = moment().hour();
      const minutes: number = moment().minutes();
      console.log(moment(), hour, minutes);
      if (dateDiff(6, 0, hour, minutes) < 0 && dateDiff(9, 0, hour, minutes) >= 0) {
        setCurrent('morning');
      } else if (
        (dateDiff(9, 0, hour, minutes) < 0 && dateDiff(11, 30, hour, minutes) >= 0) ||
        (dateDiff(13, 30, hour, minutes) < 0 && dateDiff(18, 0, hour, minutes) >= 0)
      ) {
        setCurrent('day');
      } else if (dateDiff(11, 30, hour, minutes) < 0 && dateDiff(13, 30, hour, minutes) >= 0) {
        setCurrent('lunch');
      } else if (dateDiff(18, 0, hour, minutes) < 0 && dateDiff(21, 0, hour, minutes) >= 0) {
        setCurrent('evening');
      } else {
        setCurrent('night');
      }
    };

    detectTimeOfDay();
  }, []);

  useEffect(() => {
    console.log(current);
  }, [current]);
  return (
    <Page>
      <LogoutWrapper bg={screens[current].bg}>
        {screens[current].position && <Moon position={screens[current].position} bg={moon}></Moon>}
        <Mountains bg={screens[current].mountains}></Mountains>
        <Hero bg={monetoHero}></Hero>
        <TextWrapper>
          <Heading1 color="white0" size="50" bold noMargin>
            {secondName ? t('twoFirst', { firstName, secondName }) : t('oneFirst', { firstName })}
          </Heading1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Heading3 color="white0" size="36" light noMargin>
              {current === 'lunch'
                ? t(secondName ? 'twoSecondLunch' : 'oneSecondLunch')
                : t(secondName ? 'twoSecond' : 'oneSecond')}
              &nbsp;
            </Heading3>
            <Heading1 color="white0" size="50" bold noMargin>
              {t(current)}
            </Heading1>
          </div>
        </TextWrapper>
        <PartnersWrapper>
          <Content>
            <img key={0} src={pax} alt=""/>
            <img key={2} src={pax} alt=""/>
            <img key={3} src={pax} alt=""/>
            <img key={4} src={pax} alt=""/>
            <img key={5} src={pax} alt=""/>
            <GeneralText>{t('partnersText')}</GeneralText>
          </Content>
          <Link to="partners" spy={true} smooth={true} duration={1000}>
            <ArrowButton content="downBig" size="74" color="blue1" />
          </Link>
        </PartnersWrapper>
      </LogoutWrapper>
      <Element name="partners">
        <LaptopCotnainer>
          <GeneralText>{t('partnersText')}</GeneralText>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
            <img key={0} src={pax} alt="" />
            <img key={2} src={pax} alt="" />
            <img key={3} src={pax} alt="" />
            <img key={4} src={pax} alt="" />
            <img key={5} src={pax} alt="" />
          </div>
        </LaptopCotnainer>
      </Element>
    </Page>
  );
};
