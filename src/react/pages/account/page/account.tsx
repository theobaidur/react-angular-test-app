import React from 'react';
import {
  Page,
  Row,
  Col,
  WhiteBox,
  Section,
  IconLink
} from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { ChangePasswordSection } from '../components/changePasswordSection';
import { ChangeEmailSection } from '../components/changeEmailSection';
import { Change2FASection } from '../components/change2FASection';

const AccountPage: React.FC<any> = (props: any) => {
  const { t } = useTranslation('account');

  return (
    <Page>
      <IconLink content="leftBig" to={`/`}>
        {t('backToDashboard')}
      </IconLink>
      <Section background="transparent" style={{ textAlign: 'center' }}>
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 2}>
            <WhiteBox id="changePassword">
              <ChangePasswordSection t={t}></ChangePasswordSection>
            </WhiteBox>
            <WhiteBox id="changeEmail">
              <ChangeEmailSection t={t}></ChangeEmailSection>
            </WhiteBox>
            <WhiteBox id="changeLogin">
              <Change2FASection t={t}></Change2FASection>
            </WhiteBox>
            {/* <WhiteBox>
              <ResetStateSection t={t}></ResetStateSection>
            </WhiteBox> */}
          </Col>
        </Row>
      </Section>
    </Page>
  );
};

export default AccountPage;
