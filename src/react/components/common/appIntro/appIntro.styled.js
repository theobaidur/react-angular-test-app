import styled from 'styled-components';
import colors from '../colors';
import bg from '../../../assets/images/app-intro_bg.png';
import { device } from '../device';
import { Heading1, Heading3 } from '../styled';

export const AppIntroWrapper = styled.div`
  background: ${colors.white2};
  width: 100%;
  min-height: 100vh;
  top: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  overflow: auto;
  opacity: 1;
`;

export const BackgroundAppInfo = styled.div`
  position: relative;
  width: 100%;
  background: url(${bg});
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 350px;
  height: 45vh;
  @media ${device.laptopL} {
    min-height: 275px;
  }
  @media ${device.mobileL} {
    ${Heading1} {
      font-size: 36px;
    }
    ${Heading3} {
      font-size: 24px;
    }
  }
`;

export const IconsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  img {
    margin: 0 40px;
    width: 150px;
  }
  @media ${device.laptopL} {
    img {
      width: 120px;
    }
  }
  @media ${device.mobileL} {
    img {
      width: 100px;
    }
  }
`;

export const PartnersWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  min-height: 300px;

  img {
    display: none;
    width: 160px;
    height: 60px;
    margin: 20px 40px;
    object-fit: contain;
  }
  @media ${device.laptopL} {
    min-height: 200px;
    img {
      width: 130px;
      height: 50px;
    }
  }
`;

export const LinearProgressStyled = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  .progress {
    width: 100%;
    height: 14px;
    background: transparent;
    .MuiLinearProgress-barColorPrimary {
      background: ${colors.green1};
    }
  }
`;
