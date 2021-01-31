import React from 'react';
import { Row, Col, SmallGeneralText, Heading1, PrimaryButton } from '../../../components/common/styled';
import { Trans } from 'react-i18next';

interface FeatureContainerProps {
  reverse?: boolean;
  img: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export const FeatureContainer: React.FC<FeatureContainerProps> = ({
  reverse,
  img,
  title,
  description,
  buttonText,
  buttonAction
}) => {
  return (
    <Row style={{ flexDirection: reverse ? 'row-reverse' : 'row', marginBottom: '30px' }}>
      <Col layout={0.4}>
        <img style={{ width: '100%' }} src={img} alt={title} />
      </Col>
      <Col layout={0.6}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: '100%',
            padding: '0 20px',
            justifyContent: 'center'
          }}
        >
          <Heading1>{title}</Heading1>
          <SmallGeneralText>
            <Trans>{description}</Trans>
          </SmallGeneralText>
          {buttonText && (
            <PrimaryButton style={{ margin: 0 }} main onClick={() => buttonAction && buttonAction()}>
              {buttonText}
            </PrimaryButton>
          )}
        </div>
      </Col>
    </Row>
  );
};
