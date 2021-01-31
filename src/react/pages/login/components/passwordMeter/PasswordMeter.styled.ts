import styled from 'styled-components';
import { device } from '../../../../components/common/device';

const PasswordMeterWrapper = styled.div`
  width: 95px;
`;

const RectanglesContainer = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: row;
  width: 70px;
  height: 8px;
`;

const Rectangle = styled.div.attrs(({ color }) => ({
  color: color
}))`
  background-color: ${(props) => props.color};
  display: flex;
  flex-grow: 1;
  margin-right: 4px;
`;

const StatusLabel = styled.div.attrs(({ color }) => ({
  color: color
}))`
  color: ${(props) => props.color};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 0.75rem;
  padding-bottom: 3px;
`;

const TooltipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 5px;
  left: 100%;
  @media ${device.tablet} {
    top: unset;
    left: unset;
  }
`;

export { RectanglesContainer, Rectangle, PasswordMeterWrapper, StatusLabel, TooltipWrapper };
