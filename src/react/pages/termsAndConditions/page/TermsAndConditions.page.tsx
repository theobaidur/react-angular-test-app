import React from 'react';
import { Page, Wrapper } from '../../../components/common/styled';
import { useTranslation, Trans } from 'react-i18next';

const TermsAndConditionsPage = (props: any) => {
  const { t } = useTranslation('termsAndConditions');

  return (
    <Page color={'#efefef'} paddingBottom={150} className={'contentPage'}>
      <Wrapper>
      <Trans>{`${t(`termsAndConditionsPageContent`)}`}</Trans>
      </Wrapper>
    </Page>
  );
};

export default TermsAndConditionsPage;
