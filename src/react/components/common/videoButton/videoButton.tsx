import { VideoButtonStyled } from '../styled';
import React from 'react';

interface VideoButton_Props {
  format: 'square' | 'circle';
  firstText: string;
  transparent?: boolean;
  secondText?: string;
  onClick?(): void;
}

const VideoButton = (props: VideoButton_Props) => {
  return (
    <VideoButtonStyled
      onClick={props.onClick}
      className={'flex ' + props.format + (props.transparent ? ' transparent' : '')}
    >
      <div className="play_circle">
        <div className="play_triangle" />
      </div>
      <div className="text">
        <span>{props.firstText}</span>
        <span className="question">{props.secondText}</span>
      </div>
    </VideoButtonStyled>
  );
};

export default VideoButton;
