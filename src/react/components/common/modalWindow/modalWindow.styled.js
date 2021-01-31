import styled from 'styled-components';
import colors from '../colors';
import { Icon, GeneralText, PrimaryButton, Heading3 } from '../styled';
import { device } from '../device';

export const ModalContainerHeader = styled.div.attrs(({ color }) => ({ color: color }))`
  background: ${(props) => props.color ? colors[props.color] : colors.blue1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  ${GeneralText} {
    margin-top: 10px;
  }
  ${Heading3} {
    line-height: 1.5 !important;
  }
  ${Icon} {
    &:hover {
      line-height: 40px !important;
      background: rgba(255, 255, 255, 0.3);
    }
    line-height: 40px !important;
    border-radius: 50%;
    margin: 0;
    padding: 0;
  }
`;

export const ModalContainerContent = styled.div`
  position: relative;
  padding: 20px;
  overflow: auto;
`;

export const ModalContainerFooter = styled.div.attrs(({ buttonsPosition }) => ({ buttonsPosition: buttonsPosition }))`
  padding: 20px;
  border-top: 1px solid ${colors.blue1};
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.buttonsPosition};
  ${PrimaryButton} {
    margin: 0;
  }

  @media ${device.tablet} {
    margin-top: auto;
    flex-wrap: wrap;
    padding: 0;
    ${PrimaryButton} {
      margin: 10px;
    }
  }
`;

export const ModalContainer = styled.div.attrs(({ width, height }) => ({
  width: width ? `${width}px` : '800px',
  height: height ? `${height}px` : '300px'
}))`
  width: ${(props) => props.width};
  min-height: calc(${(props) => props.height} + 85px);
  max-width: 100%;
  margin: 70px 20px;
  background: ${colors.white0};
  display: flex;
  flex-direction: column;

  ${ModalContainerContent} {
    min-height: ${(props) => props.height};
    height: 100%;
    max-height: calc(100vh - 240px);
  }
  @media ${device.tablet} {
    margin: 10px;
    min-height: 100%;
  }
`;
