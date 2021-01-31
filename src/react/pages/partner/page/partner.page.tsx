import React from 'react';
import {
  Page,
  Wrapper,
  Heading1,
  SmallGeneralText,
  Row,
  Col,
} from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { SectionHeader, OverviewSectionStyled, TextWrapper, ImagesContainer } from './partner.styled';
import { HashLink as StyledLink } from 'react-router-hash-link';

import img1 from '../assets/partner1.png';
import img2 from '../assets/partner2.png';
import img3 from '../assets/partner3.png';
import img4 from '../assets/partner4.png';
import img5 from '../assets/partner5.png';
import img6 from '../assets/partner6.png';
import img7 from '../assets/partner7.png';

const PartnerPage = (props: any) => {
  const { t } = useTranslation('partner');

  const items: Array<OverviewSection_Props> = t('overviewItems', { returnObjects: true });
  return (
    <Page color={'white'} paddingBottom={150}>
      <Wrapper>
        <Row noMargin>
          <Col>
            <Heading1 size="36" bold>
              {t('title')}
            </Heading1>{' '}
          </Col>
        </Row>
        <Row>
          <Col>
            <SectionHeader noMargin>{t('overview')}</SectionHeader>{' '}
          </Col>
        </Row>
        <Row>
          <Col>
            <TextWrapper>
              {items &&
                items.length > 0 &&
                items.map &&
                items.map((item: any, index: number) => (
                  <StyledLink key={index} className="styled-link" color="blue1" to={`#${item.link || item.title}`}>
                    {item.link || item.title}
                  </StyledLink>
                ))}
            </TextWrapper>
          </Col>
        </Row>
        {items &&
          items.length > 0 &&
          items.map &&
          items.map((item: any, index: number) => (
            <OverviewSection
              key={index}
              title={item.title}
              link={item.link}
              description={item.description}
              imgs={item.imgs}
              email={item.email}
              emailValue={item.emailValue}
              phone={item.phone}
              phoneValue={item.phoneValue}
            />
          ))}
      </Wrapper>
    </Page>
  );
};

const imgObject: any = {
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7
};

interface OverviewSection_Props {
  title: string;
  description: string;
  link?: string;
  imgs: Array<string>;
  email?: string;
  emailValue?: string;
  phone?: string;
  phoneValue?: string;
}
const OverviewSection: React.FC<OverviewSection_Props> = ({
  title,
  link,
  description,
  imgs,
  email,
  emailValue,
  phone,
  phoneValue
}) => (
  <OverviewSectionStyled id={link || title}>
    <Row>
      <Col>
        <SectionHeader noMargin>{title}</SectionHeader>
      </Col>
    </Row>
    <Row>
      <Col>
        <TextWrapper>
          <SmallGeneralText noMargin>{description}</SmallGeneralText>
        </TextWrapper>
      </Col>
    </Row>
    {imgs && imgs.length > 0 && (
      <Row>
        <Col>
          <ImagesContainer>
            {imgs.map((item: string, index: number) => (
              <img key={index} src={imgObject[item]} alt="" />
            ))}
          </ImagesContainer>
        </Col>
      </Row>
    )}
    {email && emailValue && phone && phoneValue && (
      <Row>
        <Col style={{ paddingLeft: '60px' }}>
          <SmallGeneralText noMargin>
            {email}: {emailValue}
          </SmallGeneralText>
        </Col>
        <Col style={{ paddingLeft: '60px' }}>
          <SmallGeneralText noMargin>
            {phone}: {phoneValue}
          </SmallGeneralText>
        </Col>
      </Row>
    )}
  </OverviewSectionStyled>
);

export default PartnerPage;
