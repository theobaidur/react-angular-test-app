import styled, { css } from 'styled-components';
import colors from '../../../../components/common/colors';
import { device } from '../../../../components/common/device';

const drawProgress = (x) => css`
  .pie {
    .half {
      border-color: ${colors.blue2};
    }

    .left {
      transform: rotate(calc(${x} * 3.6deg));
    }

    &.small {
      .right {
        display: none;
      }
    }
    &.big {
      clip: rect(auto, auto, auto, auto);

      .right {
        transform: rotate(180deg);
      }
    }
  }
`;
export const StyledProgress = styled.div.attrs(({ progress }) => ({
  progress: progress
}))`
  position: absolute;
  right: 25px;
  bottom: 30px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.full {
    .pie {
      border-radius: 50%;
      background: ${colors.blue1};
    }
    span {
      color: ${colors.white0};
    }
  }
  span {
    z-index: 1;
    color: ${colors.blue2};
    font-size: 14px;
  }
  span.label {
    position: absolute;
    bottom: 60px;
    transform: translateX(-50%);
    color: ${colors.blue2};
    left: 50%;
  }
  .pie {
    clip: rect(0, 56px, 56px, 28px);
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    .half {
      width: 100%;
      height: 100%;
      border: 6px solid #3498db;
      border-radius: 50%;
      clip: rect(0, 28px, 56px, 0);
      left: 0;
      position: absolute;
      top: 0;
    }
  }

  @media ${device.tablet} {
    position: relative;
    right: auto;
    bottom: auto;
    margin-top: 30px;
  }
  ${drawProgress((props) => props.progress)};
`;
