import React from 'react';
import { Row, Col } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { ViewHolder, ViewHeading } from '../../module.styled';
import showNum from '../../../utils/showNum';

const ViewPensionWorkDisability: React.FC<{ result: any }> = ({ result }) => {
  const { t } = useTranslation('module_pensionWork');
  const state = useStore().getState();

  return (
    <ViewHolder partner={state.myPartner.active}>
      <Row>
        <Col layout={state.myPartner.active ? 4.5 / 10 : 1}>
          <Row>
          <Col layout={1 / 2}>
          <ViewHeading type={2}> {t(`view.secondPillarTitleDisability`)} </ViewHeading>
          <ViewHeading size={'26'} type={2} lined>
            {' '}
            {  !result.self ? '?' : result.self.disability === 0 
              ? '?' 
              : showNum(result.self.disability)}{' '}
          </ViewHeading>
          </Col>
          <Col layout={1 / 2}>
          <ViewHeading type={2}> {t(`view.secondPillarTitleUVGDisability`)} </ViewHeading>
          <ViewHeading size={'26'} type={2} lined>
            {' '}
            {  !result.self ? '?' : result.self.uvgDisability === 0 
              ? '?' 
              : showNum(result.self.uvgDisability)}{' '}
          </ViewHeading>
          </Col>
          </Row>
        </Col>
        {state.myPartner.active ? (
          <>
            <Col layout={0.5 / 10}></Col>
            <Col layout={4.5 / 10}>
              <Row>
                <Col layout={1 / 2}>
                <ViewHeading type={2}> {t(`view.secondPillarTitleDisability`)} </ViewHeading>
                <ViewHeading size={'26'} type={2} lined>
                  {' '}
                  {  !result.partner ? '?' : result.partner.disability === 0 
                    ? '?' 
                    : showNum(result.partner.disability)}{' '}
                </ViewHeading>
                </Col>
                <Col layout={1 / 2}>
                <ViewHeading type={2}> {t(`view.secondPillarTitleUVGDisability`)} </ViewHeading>
                <ViewHeading size={'26'} type={2} lined>
                  {' '}
                  {  !result.partner ? '?' : result.partner.uvgDisability === 0 
                    ? '?' 
                    : showNum(result.partner.uvgDisability)}{' '}
                </ViewHeading>
                </Col>
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

export default ViewPensionWorkDisability;
