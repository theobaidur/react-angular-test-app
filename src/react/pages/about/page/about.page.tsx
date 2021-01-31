import React from 'react';
import {
  Page,
  Section,
  Wrapper,
  Heading1,
  Heading3,
  PrimaryButton,
  GeneralText,
  Row,
  Col
} from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import titleImg from '../assets/Titel-Bild_01.jpg';
import {
  SectionWrapper,
  IconTitleInfoStyled,
  IconTitleInfoContainer,
  Icon,
  AboutImg,
  AboutTextContainer,
  ButtonsCotnainer,
  ButtonContainerWithText
} from './about.styles';

import img01 from '../assets/01.jpg';
import img02 from '../assets/02.jpg';
import img03 from '../assets/03.jpg';
import img04 from '../assets/04.jpg';
import img05 from '../assets/05.jpg';
import img06 from '../assets/06.jpg';
import img07 from '../assets/07.jpg';
import img08 from '../assets/08.jpg';
import img09 from '../assets/09.jpg';
import img10 from '../assets/10.jpg';
import img11 from '../assets/11.jpg';
import img12 from '../assets/12.jpg';
import img13 from '../assets/13.jpg';

const aboutImages = [img01,img02,img03,img04,img05,img06,img07,img08,img09,img10,img11,img12,img13];


const AboutPage: React.FC<{ history: any }> = ({ history }) => {
  const { t } = useTranslation('about');

  const openRegisterPage = () => history.push(t('routes:register'));

  return (
    <Page color={'#efefef'} paddingBottom={0}>
      <Section img={titleImg}>
        <Wrapper>
          <SectionWrapper>
            <Heading1 bold="700" color="white0" size="54" noMargin>
              {t('title')}
            </Heading1>
            <Heading3 noMargin color="white0">
              {t('subTitle')}
            </Heading3>
            <PrimaryButton main style={{ margin: '40px 0 0' }} onClick={openRegisterPage}>
              {t('registerAccount')}
            </PrimaryButton>
          </SectionWrapper>
        </Wrapper>
      </Section>
      <Wrapper>
        <IconTitleInfoContainer>
          {(t('iconWithText', { returnObjects: true }) as Array<any>).map((item: any, index: number) => (
            <IconTitleInfo key={index} {...item} />
          ))}
        </IconTitleInfoContainer>
      </Wrapper>
      <Section background="white0">
        <Wrapper width="1200">
          <Row>
            <Col layout={0.5}>
              <Heading1 size={36} light color="grey0">
                {t('advantagesTitle')}
              </Heading1>
            </Col>
          </Row>
          {(t('advantages', { returnObjects: true, escapeInterpolation: false }) as Array<any>).map(
            (item: any, index: number) => (
              <AboutContainer key={index} {...item} />
            )
          )}

          <Row>
            <Col layout={0.4}></Col>
            <Col layout={0.6}>
              <ButtonsCotnainer>
                <RegisterButtonContainer onClick={openRegisterPage} t={t} />
                <AnotherButtonContainer t={t} />
              </ButtonsCotnainer>
            </Col>
          </Row>
        </Wrapper>
      </Section>
      <Section background="white2">
        <Wrapper width="1200">
          <Row>
            <Col layout={0.5}>
              <Heading1 size={36} light color="grey0">
                {t('myMonetoTitle')}
              </Heading1>
            </Col>
          </Row>
          {(t('myMoneto', { returnObjects: true }) as Array<any>).map((item: any, index: number) => (
            <AboutContainer key={index} {...item} />
          ))}
          <Row>
            <Col layout={0.4}></Col>
            <Col layout={0.6}>
              <ButtonsCotnainer>
                <RegisterButtonContainer onClick={openRegisterPage} t={t} />
              </ButtonsCotnainer>
            </Col>
          </Row>
        </Wrapper>
      </Section>
      <Section background="white0">
        <Wrapper width="1200">
          <Row>
            <Col layout={0.5}>
              <Heading1 size={36} light color="grey0">
                {t('aboutMonetoTitle')}
              </Heading1>
            </Col>
          </Row>
          {(t('aboutMoneto', { returnObjects: true }) as Array<any>).map((item: any, index: number) => (
            <AboutContainer key={index} {...item} />
          ))}
          <Row>
            <Col layout={0.4}></Col>
            <Col layout={0.6}>
              <ButtonsCotnainer>
                <RegisterButtonContainer onClick={openRegisterPage} t={t} />
              </ButtonsCotnainer>
            </Col>
          </Row>
        </Wrapper>
      </Section>
    </Page>
  );
};

const IconTitleInfo: React.FC<{ iconName: string; title: string; subTitle: string }> = ({
  iconName,
  title,
  subTitle
}) => (
  <IconTitleInfoStyled>
    <Icon content={iconName} />
    <GeneralText color="blue1" fontWeight="700" noMargin style={{ marginBottom: '10px' }}>
      {title}
    </GeneralText>
    <GeneralText color="grey1" noMargin>
      {subTitle}
    </GeneralText>
  </IconTitleInfoStyled>
);

const AboutContainer: React.FC<{ title: string; text: string; imgSrc: string; index: number }> = ({
  title,
  text,
  imgSrc
}) => (
  <Row style={{ marginBottom: '50px' }}>
    <Col layout={0.4}>
      <AboutImg src={aboutImages[+imgSrc]} />
    </Col>
    <Col layout={0.6}>
      <AboutTextContainer>
        <Heading1 light>{title}</Heading1>
        <GeneralText noMargin dangerouslySetInnerHTML={{ __html: text }}></GeneralText>
      </AboutTextContainer>
    </Col>
  </Row>
);

const RegisterButtonContainer: React.FC<{ t: any; onClick: () => void }> = ({ t, onClick }) => (
  <ButtonContainerWithText>
    <Heading1 color="grey0" light size={24} noMargin>
      {t('registerButton.title')}
    </Heading1>
    <GeneralText color="grey0" noMargin>
      {t('registerButton.subTitle')}
    </GeneralText>
    <PrimaryButton main onClick={onClick}>
      {t('registerButton.buttonText')}
    </PrimaryButton>
  </ButtonContainerWithText>
);

const AnotherButtonContainer: React.FC<{ t: any }> = ({ t }) => (
  <ButtonContainerWithText>
    <Heading1 light size={24} noMargin>
      {t('anotherButton.title')}
    </Heading1>
    <GeneralText noMargin>{t('anotherButton.subTitle')}</GeneralText>
    <PrimaryButton>{t('anotherButton.buttonText')}</PrimaryButton>
  </ButtonContainerWithText>
);
export default AboutPage;
