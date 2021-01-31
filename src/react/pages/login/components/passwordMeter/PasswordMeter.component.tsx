import React from 'react';
import {
  RectanglesContainer,
  Rectangle,
  PasswordMeterWrapper,
  TooltipWrapper,
  StatusLabel
} from './PasswordMeter.styled';
import { Icon } from '../../../../components/common/styled';
import zxcvbn from 'zxcvbn';
import Tooltip from '../../../../components/common/tooltip';

interface PasswordStrengthLevel {
  color: string;
  label: string;
}

interface PasswordMeterProperties {
  levels: PasswordStrengthLevel[];
  password?: string;
  tips: React.ReactNode;
}

const PasswordMeterComponent: React.FC<PasswordMeterProperties> = (props: PasswordMeterProperties) => {
  let strengthLevelIndex: number = 0;
  if (props.password != null) strengthLevelIndex = Math.max(zxcvbn(props.password).score - 2, 0);

  let isVisible: boolean = props.password !== null && props.password !== undefined && props.password.length > 0;

  return isVisible ? (
    <TooltipWrapper>
      <PasswordMeterWrapper>
        <StatusLabel color={props.levels[strengthLevelIndex].color}>
          {props.levels[strengthLevelIndex].label}
        </StatusLabel>
        <RectanglesContainer>
          {props.levels.map((item: any, index: any) => {
            return (
              <Rectangle
                key={index}
                color={index <= strengthLevelIndex ? props.levels[strengthLevelIndex].color : '#464949'}
              />
            );
          })}
        </RectanglesContainer>
      </PasswordMeterWrapper>
      <Tooltip title={props.tips} placement="top" clickToOpen>
        <Icon
          style={{ padding: 0, margin: 0, cursor: 'pointer', height: '30px' }}
          size="55"
          content="infoCircle"
          cursor="pointer"
        />
      </Tooltip>
    </TooltipWrapper>
  ) : null;
};

export default PasswordMeterComponent;
