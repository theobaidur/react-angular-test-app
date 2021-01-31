import React from 'react';
import { StyledProgress } from './progress.styled';

interface ProgressProps {
  progress: number;
  label: string;
}

const Progress: React.FC<ProgressProps> = (props: ProgressProps) => (
  <StyledProgress progress={props.progress} className={`${props.progress === 100 ? 'full' : ''} `}>
    <span className="label">{props.label}</span>
    <div className={`pie ${props.progress <= 50 ? 'small' : 'big'}`}>
      <div className="left half" />
      <div className="right half" />
    </div>
    <span> {props.progress}%</span>
  </StyledProgress>
);

export default Progress;
