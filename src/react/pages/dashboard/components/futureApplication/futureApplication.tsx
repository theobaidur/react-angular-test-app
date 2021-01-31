import React from 'react';
import { Heading3, SmallGeneralText } from '../../../../components/common/styled';
import { FutureApplicationContainer, Icon, TextContainer } from './futureApplication.styled';

interface ApplicationProps {
  title: string;
  description: string;
  iconName: string;
  background: string;
  color: string;
}

const FutureApplication: React.FC<ApplicationProps> = ({ title, description, iconName, background, color }) => (
  <FutureApplicationContainer>
    <Icon background={background} color={color} content={iconName} />
    <TextContainer>
      <Heading3 noMargin>{title}</Heading3>
      <SmallGeneralText noMargin>{description}</SmallGeneralText>
    </TextContainer>
  </FutureApplicationContainer>
);

export default FutureApplication;
