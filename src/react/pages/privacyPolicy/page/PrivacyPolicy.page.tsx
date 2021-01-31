import React from 'react';
import { Page, Wrapper } from '../../../components/common/styled';
import { useTranslation, Trans } from 'react-i18next';

const PrivacyPolicyPage = (props: any) => {
  const { t } = useTranslation('privacyPolicy');

  return (
    <Page color={'#efefef'} paddingBottom={150} className={'contentPage'}>
      <Wrapper>
      <Trans>{`${t(`privacyPolicyPageContent`)}`}</Trans>
      </Wrapper>
    </Page>
  );
};

export default PrivacyPolicyPage;
