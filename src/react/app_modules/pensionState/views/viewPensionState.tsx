import React from 'react';
import { Row, Col } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { ViewHolder, ViewHeading } from '../../module.styled';
import showNum from '../../../utils/showNum';

const ViewPensionState: React.FC<{ result: any }> = ({ result }) => {
  const { t } = useTranslation('module_pensionState');
  const state = useStore().getState();

  return (
    <ViewHolder partner={state.myPartner.active}>
      <Row>
        <Col layout={state.myPartner.active ? 4.5 / 10 : 1}>
          <ViewHeading type={1}> {t(`view.firstPillarTitle`)} </ViewHeading>
          <ViewHeading size={'26'} type={1} lined>
            {' '}
            {  !result.self ? '?' : !result.self.pension || result.self.pension === 0 
              ? '?' 
              : showNum(result.self.pension)}{' '}
          </ViewHeading>
        </Col>
        {state.myPartner.active ? (
          <>
            <Col layout={0.5 / 10}></Col>
            <Col layout={4.5 / 10}>
              <ViewHeading type={1}> {t(`view.firstPillarTitle`)} </ViewHeading>
              <ViewHeading size={'26'} type={1} lined>
                {' '}
                { !result.partner ? '?' : !result.partner.pension || result.partner.pension === 0
                  ? '?'
                  : showNum(result.partner.pension)}{' '}
              </ViewHeading>
            </Col>
          </>
        ) : (
          ''
        )}
      </Row>
    </ViewHolder>
  );
};

export default ViewPensionState;
