import React from 'react';
import StyledFooter from './footer.styled';
import { StyledFooterLink, StyledFooterSeparator } from '../styled';
import img from '../../../assets/images/moneto-full.svg';
import { useTranslation } from 'react-i18next';

const FooterComponent = () => {
  const { t } = useTranslation('footer');
  return (
    <StyledFooter>
      <img src={img} alt="moneto" className="logo" />
      <SeparatedNav>
        <StyledFooterLink key={1} to={t('routes:support')}>
          {t('navigation.support')}
        </StyledFooterLink>
        <StyledFooterLink key={2} to={t('routes:partner')}>
          {t('navigation.partner')}
        </StyledFooterLink>
        <StyledFooterLink key={3} to={t('routes:imprint')}>
          {t('navigation.imprint')}
        </StyledFooterLink>
      </SeparatedNav>
    </StyledFooter>
  );
};

const SeparatedNav: React.FC<any> = ({ ...props }) => {
  return (
    <nav>
      {props.children.map((item: any, i: number) =>
        i === props.children.length - 1 ? (
          <React.Fragment key={i}>{item}</React.Fragment>
        ) : (
          <React.Fragment key={i}>
            {item}
            <StyledFooterSeparator />
          </React.Fragment>
        )
      )}
    </nav>
  );
};

export default FooterComponent;
