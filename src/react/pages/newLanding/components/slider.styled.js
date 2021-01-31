import styled from 'styled-components';
import colors from '../../../components/common/colors';
import { ImageLanding, FlexRowContainer, FlexColumnContainer, ImgContainer } from '../page/newLanding.styled';
import { Heading1, GeneralText, Icon } from '../../../components/common/styled';
import { device } from '../../../components/common/device';

export const SliderWrapper = styled.div.attrs(({ checked }) => ({ checked: checked }))`
  display: block;
  background: #fff;
  position: relative;
  min-height: 480px;
  height: calc(100vh - 60px);
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const SliderPaginationContainer = styled.div`
  position: absolute;
  bottom: 30px;
  width: auto;
  left: 120px;
  z-index: 3;
  display: flex;
  align-items: center;
  @media ${device.tablet} {
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
  }
`;
export const SliderPaginationLabel = styled.label`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);

  margin: 0 10px;
  cursor: pointer;
  &.checked {
    background: ${colors.white0};
  }
`;

export const Slider = styled.div.attrs(({ checked }) => ({ checked: checked }))`
  width: 100%;
  height: 100%;
  min-height: 480px;
  position: absolute;
  left: 0;
  top: 0;
  display: ${(props) => (props.checked ? 'block' : 'none')}
  opacity: 1;
  z-index: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
  -webkit-transition: -webkit-transform 1000ms;
  transition: -webkit-transform 1000ms, transform 1000ms;
  -webkit-transform: scale(1);
  transform: scale(1);
  display: flex;
  justify-content: flex-start;
  -webkit-transform: translateX(${(props) => props.checked * -100}%);
  transform: translateX(${(props) => props.checked * -100}%);
  &.slide-${(props) => props.checked} {
    ${ImageLanding}, ${Heading1}, ${GeneralText}, ${FlexRowContainer}.top-container, ${FlexColumnContainer}.button,${FlexColumnContainer}.description, ${ImgContainer} {
      opacity: 1;
      transform: translateX(0px);
    }
  }
`;

export const Arrow = styled(Icon).attrs(({ position }) => ({ position: position }))`
  position: absolute;
  ${(props) => props.position}: -20px;
  top: 50%;
  z-index: 3;
  transform: translateY(-50%);
  &:before {
    font-weight: 700;
  }
  @media ${device.tablet} {
    bottom: 0;
    top: auto;
    transform: translateY(0);
  }
`;

export const ProgressWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  .MuiLinearProgress-root {
    background: rgba(255, 255, 255, 0.3);
    height: 6px;
    .MuiLinearProgress-barColorPrimary {
      background: rgba(255, 255, 255, 0.6);
    }
  }
`;
