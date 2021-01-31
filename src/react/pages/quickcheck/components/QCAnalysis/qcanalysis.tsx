import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import color from '../../../../components/common/colors';
import { PrimaryButton } from '../../../../components/common/styled';

import { Bolded, Heading1, Heading2, GeneralText, Row, Col, Message } from '../../../../components/common/styled';

import { QCLegend } from './qcanalysis.styled';

import KDiagram from '../../../../components/KDiagram';
import { Link } from 'react-router-dom';
//import { KDiagram_Data } from '../../KDiagram/kdiagram_interfaces';

const QCDiagram: React.FC<{ mode: number; data: any }> = ({ mode, data, ...props }) => {
  return (
    <>
      <div style={{ background: 'white', padding: '10px' }}>
        <KDiagram
          aspectRatio={2 / 3}
          data={data}
          hideAxis={true}
          disableEvents={true}
          disableZoom={true}
          labels={false}
        />
      </div>
      <QCLegender mode={mode} />
    </>
  );
};

const QCLegender: React.FC<{ mode: number }> = ({ mode, ...props }) => {
  const { t } = useTranslation('quickCheck');
  const legends = [t(`analysis.legendIncome`), t(`analysis.legend${mode}a`), t(`analysis.legend${mode}b`)];
  const colors = [color.gray3, color.green2, color.blue3];

  return (
    <div style={{ display: 'flex', margin: '10px 0' }}>
      {legends.map((el, i) => {
        return (
          <QCLegend key={i} color={colors[i]}>
            {el}
          </QCLegend>
        );
      })}
    </div>
  );
};

const QCResult: React.FC<{ mode: number; value: number; sub: number }> = ({ mode, value, sub, ...props }) => {
  const { t } = useTranslation('quickCheck');

  return (
    <div>
      <Bolded color={'red1'}>Achtung</Bolded>
      <Heading1 color={'red1'}>{`${t(`common.circa`)} ${value} CHF ${t(`analysis.less`)}`}</Heading1>
      <GeneralText>
        <strong>{t(`analysis.resultEstimate`)}</strong>{' '}
        {`: ${t(`common.circa`)} ${sub} CHF ${t(`analysis.resultFrom${mode}`)}`}
      </GeneralText>
    </div>
  );
};

const QCNext: React.FC<{}> = () => {
  const { t } = useTranslation('quickCheck');
  return (
    <div>
      <GeneralText>
        <Trans>{`${t(`analysis.convince`)}`}</Trans>
      </GeneralText>
      <Row>
        <PrimaryButton>{t(`common.buttonAdvantage`)}</PrimaryButton>
        <Link to={t('routes:register')}>
          <PrimaryButton main={true}>{t(`common.buttonRegister`)}</PrimaryButton>
        </Link>
      </Row>
    </div>
  );
};

interface QCAnalysis_Props {
  data: any;
}

const QCAnalysis: React.FC<QCAnalysis_Props> = ({ data, ...props }) => {
  const { t } = useTranslation('quickCheck');

  return (
    <>
      {data && (
        <>
          <div style={{ textAlign: 'center' }}>
            <Message type={'warning'}>{t(`analysis.warning`)}</Message>
          </div>
          <Heading2>{'1. ' + t(`analysis.mode1`)}</Heading2>
          <Row>
            <Col layout={1 / 3}>
              <QCDiagram data={data.pension} mode={1} />
            </Col>
            <Col layout={2 / 3}>
              <QCResult mode={1} value={data.pension.missing.value} sub={data.pension.sub} />
              <QCNext />
            </Col>
          </Row>
          <Heading2>{'2. ' + t(`analysis.mode2`)}</Heading2>
          <Row>
            <Col layout={1 / 3}>
              <QCDiagram data={data.disabilityA} mode={2} />
            </Col>
            <Col layout={2 / 3}>
              <QCResult mode={2} value={data.disabilityA.missing.value} sub={data.disabilityA.sub} />
            </Col>
          </Row>
          <Heading2>{'3. ' + t(`analysis.mode3`)}</Heading2>
          <Row>
            <Col layout={1 / 3}>
              <QCDiagram data={data.disabilityI} mode={3} />
            </Col>
            <Col layout={2 / 3}>
              <QCResult mode={3} value={data.disabilityI.missing.value} sub={data.disabilityI.sub} />
              <QCNext />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default QCAnalysis;
