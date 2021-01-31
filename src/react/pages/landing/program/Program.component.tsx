import React from 'react';
import StyledProgram from './program.styled';
import { Trans, useTranslation } from 'react-i18next';
import { Icon, Heading2, GeneralText, PrimaryButton } from '../../../components/common/styled';
import { Link } from 'react-router-dom';

type Props = {
  className?: string;
  main?: boolean;
  link: string;
};
const ProgramComponent = (props: Props) => {
  const { t } = useTranslation('landingMoneto');
  const programType = props.main ? 'exact' : 'quick';

  return (
    <StyledProgram className={props.className}>
      <Icon content={'clock'} color={'grey1'}>
        {t(`programs.${programType}.time`)}
      </Icon>
      <Heading2 color={'blue1'}>{t(`programs.${programType}.title`)}:</Heading2>
      <GeneralText color={'grey1'} noMargin>
        <Trans>{t(`programs.${programType}.content`)}</Trans>
      </GeneralText>
      <Link to={props.link}>
        <PrimaryButton main={props.main}>{t(`programs.${programType}.button`)}</PrimaryButton>
      </Link>
    </StyledProgram>
  );
};

export default ProgramComponent;
