import React from 'react';
import { Row, Col } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { ViewHolder, ViewHeading } from '../../module.styled';
import showNum from '../../../utils/showNum';

const ViewPensionStateDisability: React.FC<{ result: any }> = ({ result }) => {
  const { t } = useTranslation('module_pensionState');
  const state = useStore().getState();

  return (
    <ViewHolder partner={state.myPartner.active}>
      <Row>
        <Col layout={state.myPartner.active ? 4.5 / 10 : 1}>
          <ViewHeading type={1}> {t(`view.firstPillarTitleDisability`)} </ViewHeading>
          <ViewHeading size={'26'} type={1} lined>
            {' '}
            {  !result.self ? '?' : !result.self.disability || result.self.disability === 0 
              ? '?' 
              : showNum(result.self.disability)}{' '}
          </ViewHeading>
        </Col>
        {state.myPartner.active ? (
          <>
            <Col layout={0.5 / 10}></Col>
            <Col layout={4.5 / 10}>
              <ViewHeading type={1}> {t(`view.firstPillarTitleDisability`)} </ViewHeading>
              <ViewHeading size={'26'} type={1} lined>
                {' '}
                { !result.partner ? '?' : !result.partner.disability || result.partner.disability === 0
                  ? '?'
                  : showNum(result.partner.disability)}{' '}
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

export default ViewPensionStateDisability;
