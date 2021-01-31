import React, { useState } from 'react';
import { StepWithIcon } from '../../scanComponent/scanComponent';
import { Col, GeneralText, ProgressContainer } from '../../styled';
import { ProcessStepsWrapper } from '../../ocrProcess/components/processStepsWrapper.comonent';
import { LinearProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ModalWindow from '../../modalWindow';

interface ProgressPopupProps {
  progress: number;
}

export const ProgressPopup: React.FC<ProgressPopupProps> = ({ progress }) => {
  const [progressbar, setProgressbar] = useState<number>(0);
  const [progressReady, setProgressReady] = useState<boolean>(false);
  const { t } = useTranslation(['upload']);
  const scanTranslation = useTranslation([`scan`]);
  const st = scanTranslation.t;

  return (
    <>
      <StepWithIcon generalText={t('waitingText')} iconClass="spinner" />
      <Col center>
        <ProcessStepsWrapper
          progress={progress}
          updateProgressbar={
            typeof setProgressbar === 'function'
              ? setProgressbar
              : () => {
                  console.log('SKIP');
                }
          }
          updateReady={setProgressReady}
        ></ProcessStepsWrapper>
      </Col>
      <Col center style={{ height: '50px', visibility: progressReady ? 'visible' : 'hidden' }}>
        <GeneralText noMargin color={'blue1'} style={{ position: 'relative', top: '10px' }}>
          {st('progress.ready')}
        </GeneralText>
      </Col>
      <ProgressContainer
        isAlwaysVisible
        disableAnimation={progressbar !== undefined && progressbar === 0 && progress !== 0}
        color={'blue1'}
        style={{
          width: '100%',
          height: '15px',
          position: 'unset',
          top: 'unset'
        }}
      >
        {!progressReady && progress !== 0 ? (
          <LinearProgress
            style={{ height: '15px', opacity: 1 }}
            value={progressbar ? progressbar : 0}
            variant={'determinate'}
          ></LinearProgress>
        ) : (
          <div>
            <LinearProgress
              style={{ height: '15px', opacity: 0.5 }}
              value={progressbar ? progressbar : 0}
              variant={'indeterminate'}
            ></LinearProgress>
          </div>
        )}
      </ProgressContainer>
    </>
  );
};

interface DummyProgressPopupProps {
  templateName?: string;
  onClose?: any;
}

export const DummyProgressPopup: React.FC<DummyProgressPopupProps> = ({ templateName, onClose }) => {
  const uploadTranslation = useTranslation(['upload']);
  const ut = uploadTranslation.t;
  return (
    <ModalWindow
      isOpen={true}
      toggle={() => undefined}
      title={ut('header.title')}
      subTitle={ut('header.descriptionImg', { templateName: templateName || 'PK' })}
      onClose={onClose}
    >
      <ProgressPopup progress={100}></ProgressPopup>
    </ModalWindow>
  );
};
