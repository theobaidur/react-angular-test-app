import React, { useState, useEffect } from 'react';
import { Page, Row, Col, Icon, Section, Separator } from '../../../components/common/styled';
import { Link } from 'react-router-dom';
import { TabsComponent, TabsContainer, TabContent } from '../../../components/common/tabs';
import { Tab } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import ResetPasswordTab from '../components/resetPasswordTab';
import NewPasswordTab from '../components/newPasswordTab';

interface ResetPasswordPage_Props {
  history: any;
}

const ResetPasswordPage: React.FC<ResetPasswordPage_Props> = ({ history }) => {
  const [activeTab, setActiveTab] = useState<string>('resetPassword');
  const { t } = useTranslation('resetPassword');
  const [code, setCode] = useState<string>('');
  const [unlocker, setUnlocker] = useState<string>('');

  useEffect(() => {
    const params: any = queryString.parse(history.location.search);
    if (params.code && params.unlocker) {
      setActiveTab('newPassword');
      setCode(params.code);
      setUnlocker(params.unlocker);
    }
  }, [history.location.search]);

  return (
    <Page color="#303435" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <Section background="grey0" minHeight={'15vh'}>
        <Row noMargin>
          <Col layout={1} force align="right">
            <Link to="/">
              <Icon
                style={{ padding: 0, margin: 0, cursor: 'pointer', float: 'right' }}
                size="55"
                content="close"
                cursor="pointer"
              />
            </Link>
          </Col>
        </Row>
      </Section>
      <Section background="grey0" style={{ textAlign: 'center' }}>
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 2} align="center">
            <Row>
              <Col layout={1}>
                <TabsComponent
                  defaultTab={activeTab}
                  onChanged={(val) => {
                    setActiveTab(val);
                  }}
                >
                  [<Tab key="1" value={activeTab} label={t(activeTab)}></Tab>]
                </TabsComponent>
              </Col>
            </Row>
          </Col>
          <Col layout={1 / 4} />
        </Row>
        <Separator />
        <Row noMargin style={{ maxWidth: '500px', display: 'inline-block' }}>
          <Col layout={1 / 4} />
          <Col layout={1 / 2} align="center">
            <TabsContainer activeTabId={activeTab}>
              <TabContent id="resetPassword">
                <ResetPasswordTab t={t} />
              </TabContent>
              <TabContent id="newPassword">
                <NewPasswordTab unlocker={unlocker} code={code} t={t} history={history} />
              </TabContent>
            </TabsContainer>
          </Col>
        </Row>
      </Section>
    </Page>
  );
};

export default ResetPasswordPage;
