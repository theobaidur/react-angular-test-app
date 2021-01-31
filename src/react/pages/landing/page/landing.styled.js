import styled from 'styled-components';
import { PrimaryButton, GeneralText, VideoButtonStyled } from '../../../components/common/styled';
import { device } from '../../../components/common/device';

export const FlexContainer = styled.div.attrs(({ position }) => ({ position: position }))`
  align-items: ${(props) => `flex-${props.position}`};
  flex-direction: column;
  display: flex;
  ${PrimaryButton} {
    margin: 0;
  }
  ${GeneralText} {
    margin: 0 8px 10px;
  }
  ${VideoButtonStyled} {
    margin-top: 29px;
  }
  @media ${device.tablet} {
    align-items: center;
  }
`;

export const ImgLogo = styled.img`
  width: 100px;
`;
