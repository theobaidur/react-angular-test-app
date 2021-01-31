import React from 'react';
import { StyledApplicationWrapper, StyledApplication, IconsWrapper } from './application.styled';
import { Heading3, SmallGeneralText, PrimaryButton } from '../../../../components/common/styled';
import Progress from '../progress';
import { Trans } from 'react-i18next';
import i18next from 'i18next';

interface ApplicationProps {
  name: string;
  icon: string;
  chart: string;
  buttonText: string;
  description: string;
  link: string;
  progress: number;
  history: any;
  doneLabel: string;
  showProgress: boolean;
}

const Application: React.FC<ApplicationProps> = (props: ApplicationProps) => {
  return (
    <StyledApplicationWrapper>
      <Heading3 light noMargin>
        {props.name}
      </Heading3>
      <StyledApplication>
        <SmallGeneralText>
          <Trans>{props.description} </Trans>
        </SmallGeneralText>

        <IconsWrapper>
          <img src={props.chart} alt="Chart img" />
          <img src={props.icon} alt="Logo img" />
        </IconsWrapper>
        {props.progress > 0 && props.showProgress && <Progress progress={props.progress} label={props.doneLabel} />}
        <PrimaryButton center onClick={() => props.history.push(i18next.t(`routes:${props.link}`))}>
          {props.buttonText}
        </PrimaryButton>
      </StyledApplication>
    </StyledApplicationWrapper>
  );
};

export default Application;
