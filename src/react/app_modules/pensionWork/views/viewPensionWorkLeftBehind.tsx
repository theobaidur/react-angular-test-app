import React from 'react';
import { Row, Col } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { ViewHolder, ViewHeading } from '../../module.styled';
import showNum from '../../../utils/showNum';

const ViewPensionWorkLeftBehind: React.FC<{ result: any }> = ({ result }) => {
  const { t } = useTranslation('module_pensionWork');
  const state = useStore().getState();

  return (
    <ViewHolder partner={state.myPartner.active}>
      <Row>
        <Col layout={state.myPartner.active ? 4.5 / 10 : 1}>
          <Row>
          <Col layout={1 / 2}>
          <ViewHeading type={2}> {t(`view.secondPillarTitleWidow`)} </ViewHeading>
          <ViewHeading size={'26'} type={2} lined>
            {' '}
            {  !result.self ? '?' : result.self.widow === 0 
              ? '?' 
              : showNum(result.self.widow)}{' '}
          </ViewHeading>
          </Col>
          { state.myConnection.mode[0] === 1 ? (
            <Col layout={1 / 2}>
            <ViewHeading type={2}> {t(`view.secondPillarTitleUVGWidow`)} </ViewHeading>
            <ViewHeading size={'26'} type={2} lined>
              {' '}
              {  !result.self ? '?' : result.self.uvgWidow === 0 
                ? '?' 
                : showNum(result.self.uvgWidow)}{' '}
            </ViewHeading>
            </Col>
          ) : '' }
          </Row>
        </Col>
        {state.myPartner.active ? (
          <>
          { state.myConnection.mode[0] === 1 ? (
            <Col layout={0.5 / 10}></Col>
          ) : '' }
            <Col layout={4.5 / 10}>
              <Row>
                <Col layout={1 / 2}>
                <ViewHeading type={2}> {t(`view.secondPillarTitleWidow`)} </ViewHeading>
                <ViewHeading size={'26'} type={2} lined>
                  {' '}
                  {  !result.partner ? '?' : result.partner.widow === 0 
                    ? '?' 
                    : showNum(result.partner.widow)}{' '}
                </ViewHeading>
                </Col>
                { state.myConnection.mode[0] === 1 ? (
                  <Col layout={1 / 2}>
                  <ViewHeading type={2}> {t(`view.secondPillarTitleUVGWidow`)} </ViewHeading>
                  <ViewHeading size={'26'} type={2} lined>
                    {' '}
                    {  !result.partner ? '?' : result.partner.uvgWidow === 0 
                      ? '?' 
                      : showNum(result.partner.uvgWidow)}{' '}
                  </ViewHeading>
                  </Col>
                ) : '' }
              </Row>
            </Col>
          </>
        ) : (
          ''
        )}
      </Row>
    </ViewHolder>
  );
};

export default ViewPensionWorkLeftBehind;
