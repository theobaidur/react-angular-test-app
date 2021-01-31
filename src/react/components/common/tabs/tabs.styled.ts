import colors from '../colors';
import styled from 'styled-components';
import { device } from '../../../components/common/device';

export const TabsComponentWrapper = styled.div.attrs(({ color }) => ({
  color: color ? (colors as any)[color] : colors.white1
}))`
  .MuiTabs-indicator {
    background-color: ${colors.blue1};
    height: 4px;
    z-index: 1;
  }
  .MuiTab-wrapper {
    font-size: 23px;
    line-height: 1;
    @media ${device.tablet} {
      font-size: 16px;
    }
  }
  .MuiTab-root {
    padding-left: 1px;
    padding-right: 1px;
    padding-bottom: 2px;
    color: ${colors.grey1};
    background: transparent;
    font-weight: 200;
    &.Mui-selected {
      color: ${(props) => props.color};
      background: transparent;
    }
  }
`;
