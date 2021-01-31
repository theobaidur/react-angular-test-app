import React from 'react';
import { Page, Wrapper } from '../../../components/common/styled';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

const ImprintPage = (props: any) => {
  const { t } = useTranslation(['imprint','routes']);

  return (
    <Page color={'#efefef'} paddingBottom={150} className={'contentPage'}>
      <Wrapper>
      <Trans>{t(`imprintContent`)}</Trans>
      <br></br><br></br>
      <Link to={t(`routes:privacy-policy`)}>{t(`imprintPrivacyPolicy`)}</Link>
      <br></br>
      <Link to={t(`routes:terms-of-use`)}>{t(`imprintTermsOfUse`)}</Link>
      <br></br>
      <Link to={t(`routes:terms-and-conditions`)}>{t(`imprintTermsAndConditions`)}</Link>
      <br></br><br></br>
      <Trans>{t(`imprintDisclaimer`)}</Trans>
      </Wrapper>
    </Page>
  );
};

export default ImprintPage;
