import React, { useEffect, useState } from 'react';
import { GeneralText, Icon } from '../../styled';
import { useTranslation } from 'react-i18next';
import { useMemoizedCallback } from '../../../../utils/customCallbackHook';

export interface ProcessStepsWrapper_Props {
  progress: number;
  updateProgressbar: (relativeProgress: number) => void;
  updateReady: (isReady: boolean) => void;
}

let progressQueue: any = [];
let isTickInProgress: boolean = false;
let tickTimeout: any = {};

const tick = () => {
  if (isTickInProgress) {
    return;
  }
  isTickInProgress = true;

  const ticker = () => {
    isTickInProgress = false;
    tick();
  };

  while (progressQueue.length > 0) {
    var packet = progressQueue.shift();
    packet.func(packet.value);

    if (packet.timeout > 0) {
      tickTimeout = setTimeout(ticker, packet.timeout);
      return;
    }
  }

  isTickInProgress = false;
};

export const ProcessStepsWrapper: React.FC<ProcessStepsWrapper_Props> = ({
  progress,
  updateProgressbar,
  updateReady
}) => {
  const { t } = useTranslation(['scan']);

  const steps = [
    { endProgress: 25, text: t('progress.step1') },
    { endProgress: 50, text: t('progress.step2') },
    { endProgress: 100, text: t('progress.step3') }
  ];
  const [previous, setPrevious] = useState(0);

  const [activeStep, setActiveStep] = useState(0);
  const incrementState = () => {
    setActiveStep((s) => {
      return s + 1;
    });
  };

  const onProgressChanged = useMemoizedCallback(() => {
    if (previous === 0 && progress === 100) {
      setActiveStep(steps.length);
      updateReady(true);
      return;
    }

    const updateProgressbarInternal = (progressValue: number, timeoutValue?: number) => {
      progressQueue.push({ func: updateProgressbar, value: progressValue, timeout: timeoutValue });
      tick();
    };

    for (let s = 0; s < steps.length; ++s) {
      let startProgress = s > 0 ? steps[s - 1].endProgress + 1 : 0;
      let endProgress = steps[s].endProgress;

      if (progress >= startProgress && progress <= endProgress) {
        if (previous !== s) {
          updateProgressbarInternal(100, 500);
          progressQueue.push({ func: incrementState });
          console.log('PUSH -> ' + activeStep + ' ' + progress);
          updateProgressbarInternal(0, 50);
          setPrevious(s);
        } else {
          console.log('UPDATE -> ' + activeStep + ' ' + progress);
          const stepProgress =
            ((endProgress - startProgress - (endProgress - progress)) / (endProgress - startProgress)) * 100;
          updateProgressbarInternal(stepProgress);
          if (s === steps.length - 1 && stepProgress === 100) {
            progressQueue.push({ func: incrementState, timeout: 1000 });
            progressQueue.push({ func: updateReady, value: true });
            tick();
          }
        }

        break;
      }
    }
  }, [progress, activeStep, previous, setPrevious, steps, updateReady, updateProgressbar, setActiveStep]);

  useEffect(() => {
    onProgressChanged();
  }, [progress, onProgressChanged]);

  useEffect(() => {
    return () => {
      if (tickTimeout) clearTimeout(tickTimeout);
      tickTimeout = {};
      progressQueue = [];
      isTickInProgress = false;
    };
  }, []);

  return (
    <>
      <ul style={{ position: 'relative', width: '150px' }}>
        {steps.map((s: any, i: number) => {
          return (
            <ProcessStepItem
              key={i}
              text={s.text}
              isActive={activeStep === i}
              isReady={i < activeStep}
            ></ProcessStepItem>
          );
        })}
      </ul>
    </>
  );
};

export interface ProcessStepsItem_Props {
  text: string;
  isActive: boolean;
  isReady: boolean;
}

const ProcessStepItem: React.FC<ProcessStepsItem_Props> = ({ text, isActive, isReady }) => {
  return (
    <>
      <li style={{ display: 'flex', alignItems: 'center' }}>
        <GeneralText noMargin style={{ lineHeight: '1.6em' }} color={isActive ? 'blue1' : 'grey1'}>
          {text}
        </GeneralText>
        {isReady ? (
          <Icon
            style={{ padding: 0, margin: 0, position: 'absolute', right: '0px' }}
            size="32"
            content="check"
            color="grey1"
          />
        ) : null}
      </li>
    </>
  );
};
