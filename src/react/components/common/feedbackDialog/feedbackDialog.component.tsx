import React, { useState } from 'react';
import { PrimaryButton, Icon } from '../styled';
import ModalWindow from '../modalWindow';
import { KText } from '../../KForm';

interface FeedbackDialog_Props {
  t: any;
  isOpen: boolean;
  feedbackCallback: Function | undefined;
  onApprove: (score: any, description: any) => void;
}

const FeedbackDialog: React.FC<FeedbackDialog_Props> = ({ isOpen, feedbackCallback, onApprove, t }) => {
  const activeColor = 'green1';
  const inactiveColor = 'green0';
  const activeContent = 'starFilled';
  const inactiveContent = 'star';

  const [starsState, setStarsState] = useState([false, false, false, false, false]);
  const [score, setScore] = useState<number>();
  const [description, setDescription] = useState();

  const onRated = (rate: number) => {
    setScore(rate + 1);
    onEnter(rate);
  };

  const onClose = () => {
    if (feedbackCallback) {
      feedbackCallback();
    }
  };

  const onEnter = (rate: number) => {
    let newStarsState = [true, true, true, true, true];
    for (let i = rate + 1; i < newStarsState.length; ++i) {
      newStarsState[i] = false;
    }
    setStarsState(newStarsState);
  };
  const resetStars = () => {
    setStarsState([false, false, false, false, false]);
  };
  return (
    <ModalWindow
      isOpen={isOpen}
      toggle={onClose}
      width={500}
      height={100}
      title={t(`feedback.title`)}
      buttons={[
        <PrimaryButton key={0} outlined onClick={onClose}>
          {t('feedback.cancel')}
        </PrimaryButton>,
        <PrimaryButton
          key={1}
          onClick={() => {
            onApprove(score, description);
          }}
          disabled={!(score && score > 0)}
        >
          {t('feedback.approve')}
        </PrimaryButton>
      ]}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-around' }}
        onMouseLeave={() => {
          if (!score) resetStars();
        }}
      >
        {starsState.map((val, iter) => {
          return (
            <Icon
              key={iter}
              color={val ? activeColor : inactiveColor}
              style={{ padding: 0, margin: 0 }}
              size="64"
              content={val ? activeContent : inactiveContent}
              onClick={() => {
                onRated(iter);
              }}
              onMouseEnter={() => {
                if (!score) onEnter(iter);
              }}
            />
          );
        })}
      </div>
      {score && score < 3 ? (
        <div>
          <KText
            name={'description'}
            label={t(`feedback.descriptionPlaceholder`)}
            fieldValue={description}
            setFieldValue={(name: string, value: any) => setDescription(value)}
          />
        </div>
      ) : null}
    </ModalWindow>
  );
};

export default FeedbackDialog;
