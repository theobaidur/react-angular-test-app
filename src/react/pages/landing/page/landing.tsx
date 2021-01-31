import React, { useState } from 'react';
import {
  Page,
  Wrapper,
  Row,
  Col,
  Section,
  Heading1,
  Heading2,
  GeneralText,
  Icon,
  PrimaryButton
} from '../../../components/common/styled';

import VideoButton from '../../../components/common/videoButton';
import img from '../../../assets/images/moneto-full.svg';
import hero from '../../../assets/images/bg01.png';
import imgLabel from '../../../assets/images/moneto-label.svg';
import monetoVideo from '../../../assets/videos/Was-ist-Moneto.mp4';
import { useTranslation, Trans } from 'react-i18next';
import Footer from '../../../components/common/footer';
import VideoPlayer from '../../../components/common/videoPlayer';
import { FeatureContainer } from '../feature/feature';
import feature1 from '../../../assets/images/lp_pic1.png';
import feature2 from '../../../assets/images/lp_pic2.png';
import feature3 from '../../../assets/images/lp_pic3.png';
import { FlexContainer, ImgLogo } from './landing.styled';
import { Link } from 'react-router-dom';

const Landing = (props: any) => {
  const { t } = useTranslation(['landingMoneto', 'routes']);
  const benefits: object[] = t('benefits', { returnObjects: true }) || [];
  const [isOpen, setOpen] = useState(false);

  const features: { [x: string]: any } = {
    first: feature1,
    second: feature2,
    third: feature3
  };

  const featureItems: Array<any> = t('features', { returnObjects: true });

  return (
    <>
      <Page>
        <Section className={'hero'} img={hero}>
          <Wrapper>
            <Row>
              <Col layout={1}>
                <FlexContainer position="start">
                  <ImgLogo src={img} alt="logo" className="desktop" />
                  <img src={imgLabel} alt="logo" className="mobile" />
                </FlexContainer>
              </Col>
              <Col layout={1}>
                <Heading1 color={'white0'} size={32} light>
                  {t('firstSectionHeadline')}
                </Heading1>
              </Col>
            </Row>
            <Row style={{ marginTop: '60px' }}>
              <Col layout={0.5}>
                <FlexContainer position="start">
                  <VideoButton
                    format="circle"
                    firstText={t('videoButtonText')}
                    secondText={t('videoButtonQuestion')}
                    onClick={() => setOpen(true)}
                  />
                  <VideoPlayer
                    isOpen={isOpen}
                    toggle={() => setOpen((open: boolean) => !open)}
                    src={monetoVideo}
                  ></VideoPlayer>
                </FlexContainer>
              </Col>
              <Col layout={0.5}>
                <FlexContainer position="end">
                  <GeneralText color="white0"> {t('registerText')}</GeneralText>
                  <Link to={t('routes:register')}>
                    <PrimaryButton main height="56">
                      {t('register')}
                    </PrimaryButton>
                  </Link>
                </FlexContainer>
              </Col>
            </Row>
          </Wrapper>
        </Section>

        <Section background={'white0'}>
          <Wrapper>
            {featureItems.map((item: any, index: number) => (
              <FeatureContainer
                key={index}
                reverse={!(index % 2)}
                img={features[item.img]}
                title={item.title}
                description={item.description}
                buttonText={item.register}
                buttonAction={() => props.history.push(t('routes:register'))}
              />
            ))}
          </Wrapper>
        </Section>

        <Section background={'white3'}>
          <Wrapper>
            {benefits.map((e: object, i: number) => {
              return (
                <Row key={i}>
                  <Col layout={1 / 8} layoutS={1 / 3} center force>
                    <Icon content={t(`benefits.${i}.icon`)} center size={60} />
                  </Col>
                  <Col layout={7 / 8} layoutS={2 / 3} force>
                    <Heading2 color={'blue1'}>{t(`benefits.${i}.title`)}</Heading2>
                    <GeneralText color={'grey1'}>
                      <Trans>{t(`benefits.${i}.content`)}</Trans>
                    </GeneralText>
                  </Col>
                </Row>
              );
            })}
          </Wrapper>
        </Section>
      </Page>
      <Footer />
    </>
  );
};

export default Landing;
