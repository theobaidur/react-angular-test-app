import styled from 'styled-components';
import { device } from '../device';
import colors from '../colors';
import { Icon } from '../styled';

export const StyledVideoWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: hidden;
  & > div {
    width: 100vw !important;
    height: 100vh !important;
  }
  ${Icon} {
    position: absolute;
    top: 0;
    right: 0;
    width: 64px;
    height: 64px;
    margin: 0;
    background: ${colors.white1};
    border-bottom-left-radius: 50%;
    &:hover {
      background: ${colors.white3};
    }
    &:before {
      font-weight: 700;
    }
  }
  @media ${device.tablet} {
    & > div {
      width: 100% !important;
      height: 100vh !important;
    }
  }
`;
