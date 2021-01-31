import React from 'react';
import { Page, Wrapper } from '../../../components/common/styled';
import { useTranslation, Trans } from 'react-i18next';

const TermsOfUsePage = (props: any) => {
  const { t } = useTranslation('termsOfUse');

  return (
    <Page color={'#efefef'} paddingBottom={150} className={'contentPage'}>
      <Wrapper>
      <Trans>{`${t(`termsOfUsePageContent`)}`}</Trans>
      </Wrapper>
    </Page>
  );
};

export default TermsOfUsePage;
