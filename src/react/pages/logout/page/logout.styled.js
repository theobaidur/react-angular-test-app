import styled from 'styled-components';
import { Heading3, Heading1, GeneralText, Icon } from '../../../components/common/styled';
import { device } from '../../../components/common/device';

export const LogoutWrapper = styled.div.attrs(({ bg }) => ({ bg: bg }))`
  position: relative;
  height: calc(100vh - 60px);
  min-height: 450px;
  width: 100vw;
  background: url(${(props) => props.bg});
  background-size: cover;
  overflow: hidden;
  @media ${device.tablet} {
    background-position: right bottom;
    min-height: auto;
  }
`;

export const Mountains = styled.div.attrs(({ bg }) => ({ bg: bg }))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(${(props) => props.bg});
  background-size: contain;
  min-width: 1000px;
  background-repeat: no-repeat;
  background-position: right bottom;
  @media ${device.tablet} {
    background-position: center bottom;
    bottom: -100px;
    background-size: auto;
  }
  @media ${device.tablet} and (orientation: landscape) {
    background-size: cover;
  }
`;

export const Hero = styled.div.attrs(({ bg }) => ({ bg: bg }))`
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 100%;
  height: 80%;
  background: url(${(props) => props.bg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left bottom;
  @media ${device.laptopL} {
    left: 3%;
  }
  @media ${device.tablet} {
    left: -60px;
  }
  @media ${device.tablet} and (orientation: landscape) {
    left: 0;
  }
`;

export const Moon = styled.div.attrs(({ bg, position }) => ({ bg: bg, position: position }))`
  position: absolute;
  ${(props) => props.position}: -150px;
  width: 100%;
  height: 70%;
  max-height: 500px;
  background: url(${(props) => props.bg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: ${(props) => (props.position === 'top' ? 'right' : props.position)} top;
  @media ${device.laptop} {
    display: none;
  }
`;

export const TextWrapper = styled.div`
  position: absolute;
  top: 10%;
  right: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${Heading1}, ${Heading3} {
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  }
  @media ${device.laptopL} {
    right: 5%;
    top: 5%;
  }
  @media ${device.laptop} {
    ${Heading1} {
      font-size: 36px;
    }
    ${Heading3} {
      font-size: 24px;
    }
  }

  @media ${device.tablet} {
    right: 0;
    top: 20px;
    width: 400px;
    ${Heading1} {
      font-size: 24px;
    }
    ${Heading3} {
      font-size: 15px;
    }
  }
  @media ${device.mobileL} {
    width: 250px;
    text-align: center;
    div {
      flex-direction: column;
    }
  }
`;

export const PartnersWrapper = styled.div`
  position: absolute;
  height: 300px;
  bottom: -100px;
  width: 100%;
  transform: skewY(-4deg);
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  @media ${device.laptopL} {
    height: 250px;
  }
  @media ${device.laptop} {
    height: 200px;
  }
  @media ${device.tablet} {
    height: 150px;
    transform: skewY(-2deg);
  }
`;

export const Content = styled.div`
  position: absolute;
  padding: 0 20px 0 300px;
  display: flex;
  align-items: self-end;
  justify-content: space-between;
  width: 100%;
  transform: skewY(4deg);
  ${GeneralText} {
    width: 400px;
    margin: 0 40px 0 auto;
  }
  img {
    width: 120px;
    display: none;
  }
  @media ${device.laptopL} {
    padding: 0 20px 0 60px;
    ${GeneralText} {
      width: 400px;
      margin: 0 20px 0 100px;
    }
    img {
      width: 90px;
    }
    @media ${device.laptop} {
      display: none;
    }
  }
`;
export const ArrowButton = styled(Icon)`
  display: none;

  @media ${device.laptop} {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) skewY(4deg);
    font-weight: 700;
    bottom: 70px;
  }
  @media ${device.tablet} {
    transform: translateX(-50%) skewY(2deg);
    bottom: 45px;
  }
`;

export const LaptopCotnainer = styled.div`
  display: none;
  position: relative;
  padding: 40px;
  img {
    width: 200px;
    display: none;
    margin: 20px 40px;
  }
  @media ${device.laptop} {
    display: block;
  }
`;
