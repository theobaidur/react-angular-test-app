import styled, { css } from 'styled-components';
import monetoLabel from '../../../assets/images/moneto-label.svg';
import monetoLogo from '../../../assets/images/moneto-logo.svg';
import { VideoButtonStyled, Heading1, PrimaryButton, GeneralText } from '../../../components/common/styled';
import { device } from '../../../components/common/device';

const transition = (delay, left) => css`
  opacity: 0;
  transform: translateX(${left ? '-600px' : '600px'});
  transition: transform 600ms, opacity 600ms;
  transition-delay: ${delay}s;
`;

export const SlideContent = styled.div.attrs(({ bgImg }) => ({ bgImg: bgImg }))`
  position: relative;
  width: 100%;
  height: 100%;
  background: url(${(props) => props.bgImg});
  background-size: cover;
  min-height: 480px;
  display: flex;
  overflow: hidden;
  @media ${device.tablet} {
    flex-direction: column;
    background-position: right;
  }
`;

export const SlideLeft = styled.div`
  min-width: 70%;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: space-between;
  height: 100%;
  padding: 60px 120px;
  @media ${device.laptopL} {
    padding: 30px 60px;
    ${Heading1} {
      font-size: 36px;
    }
  }
  @media ${device.laptop} {
    padding: 20px 40px;
    min-width: 65%;
    ${Heading1} {
      font-size: 24px;
    }
  }
  @media ${device.tablet} {
    min-width: 100%;
    width: 100%;
  }
  @media ${device.mobileL} {
    padding: 10px 20px;
  }
`;

export const SlideRight = styled.div`
  position: static;
  min-width: 35%;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  height: 100%;
  transform: skewX(-13deg);
  @media ${device.laptopL} {
    transform: skewX(-11deg);
    min-width: 45%;
  }
  @media ${device.laptop} {
    transform: skewX(-8deg);
  }
  @media ${device.tablet} {
    display: none;
  }
`;

export const MonetoLabel = styled.div`
  background: url(${monetoLabel});
  background-size: contain;
  background-repeat: no-repeat;
  width: 100px;
  height: 23px;
  @media ${device.mobileL} {
    width: 70px;
  }
`;

export const MonetoLogo = styled.div`
  background: url(${monetoLogo});
  background-size: contain;
  background-repeat: no-repeat;
  width: 44px;
  height: 55px;
  @media ${device.mobileL} {
    width: 36px;
    height: 44px;
  }
`;

export const StyledMonetoLogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlexRowContainer = styled.div`
  display: flex;
  width: 100%;
  &.margin {
    margin: 20px 0 100px;
    height: 100%;
    @media ${device.laptop} {
      flex-direction: column-reverse;
    }
  }
  &.top-container {
    align-items: center;
    ${VideoButtonStyled} {
      margin: 0 0 0 160px;
    }

    ${transition(0.4, true)}
  }
  @media ${device.laptop} {
    &.top-container ${VideoButtonStyled} {
      margin-left: 80px;
    }
  }
  @media ${device.tablet} {
    &.top-container ${VideoButtonStyled} {
      width: 220px;
      margin-left: 40px;
    }
    &.margin {
      margin: 30px 0;
      height: 100%;
      justify-content: space-between;
    }
  }
  @media ${device.mobileL} {
    align-items: center;
    ${VideoButtonStyled} {
      margin: 0 0 0 auto;
    }
  }
`;

export const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: start;

  ${PrimaryButton} {
    margin: 10px 0;
  }
  ${GeneralText} {
    ${transition(0.5, false)}
  }
  ${Heading1}, &.description {
    margin-top: 0;
    ${transition(0.3, false)}
  }
  &.content {
    justify-content: center;
  }
  &.button {
    width: auto;
    align-items: center;
    margin-top: 60px;
    ${transition(0.6, true)}
  }
  &.description {
    padding-right: 100px;
  }
  @media ${device.laptop} {
    &.button {
      margin: 40px auto 0;
    }
    &.content {
      height: 100%;
      justify-content: space-between;
    }
    &.description {
      padding-right: 40px;
    }
  }
`;

export const ImageLanding = styled.img`
  width: 400px;
  object-fit: contain;
  margin-left: 20px;
  ${transition(0.7, false)}
  @media ${device.laptopL} {
    width: 300px;
  }
  @media ${device.laptop} {
    width: 220px;
  }
  @media ${device.tablet} {
    width: 300px;
    margin: 0 auto;
  }
  @media ${device.mobileL} {
    width: 120px;
  }
`;

export const SlideRightContent = styled.div`
  position: absolute;
  right: 0;
  transform: skewX(13deg);
  width: 100%;
  padding: 40px 160px 20px 80px;
  @media ${device.laptopL} {
    transform: skewX(11deg);
    padding: 40px 220px 20px 80px;
  }
  @media ${device.laptop} {
    transform: skewX(8deg);
    padding: 40px 120px 20px 60px;
  }
  @media ${device.tablet} {
    transform: skewX(0);
  }
`;

export const ImgContainer = styled.img.attrs(({ index }) => ({ index: index }))`
  width: 200px;
  margin: 30px auto;
  object-fit: contain;
  ${transition((props) => 0.2 + 0.15 * props.index, false)}
  @media ${device.laptopL} {
    width: 170px;
  }
  @media ${device.laptop} {
    width: 130px;
    margin: 25px auto;
  }
`;

export const MobileView = styled.div`
  display: none;
  @media ${device.tablet} {
    display: block;
    ${SlideRightContent} {
      padding: 40px;
    }
    .description,
    .description ${GeneralText}, .description ${Heading1}, ${ImgContainer} {
      color: black;
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
