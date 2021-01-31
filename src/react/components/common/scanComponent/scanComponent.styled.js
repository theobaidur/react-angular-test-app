import colors from '../colors';
import icons from '../icons';
import { device } from '../device';
import styled, { keyframes } from 'styled-components';
import DropZoneStyled from '../dropZone/dropZone.styled';

export const ScanComponentWrapper = styled.div`
  position: fixed;
  min-height: calc(var(--vh, 1vh) * 100);
  top: 0;
  width: calc(100% + 1px);
  left: 50%;
  background-color: ${colors.white1};
  transform: translateX(calc(-50%));
  display: flex;
  flex-direction: column;
  z-index: 6;
  @media ${device.tablet} {
  }
`;

export const ImgWithLabelContainer = styled.div`
  margin: 15px 0;
`;

export const ButtonWithIcon = styled.button.attrs(({ content, color, backgroundColor }) => ({
  content: content ? icons[content] : icons.photo,
  color: color ? colors[color] : colors.green1,
  backgroundColor: backgroundColor ? colors[backgroundColor] : 'transparent'
}))`
  outline: none;
  border: 0;
  display: flex;
  align-items: center;
  color: ${(props) => props.color};

  border: 1px solid ${(props) => props.color};
  background: ${(props) => props.backgroundColor};
  padding: 0 15px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 20px;
  i:before {
    content: \'${(props) => props.content}\';
    font-family: leinero;
    color: ${(props) => props.color};
    font-style: normal;
    font-size: 28px;
    line-height: 28px;
    height: 28px;
    margin-right: 5px;
  }
`;

export const ScanContentWrapper = styled.div.attrs(({ isIkAuszugPart }) => ({
  isIkAuszugPart: isIkAuszugPart,
  boxShadow: isIkAuszugPart === 'yes' ? 'none' : '1px 3px 5px rgba(0, 0, 0, 0.3)',
  margin: isIkAuszugPart === 'yes' ? '0' : '20px auto',
  overflow: isIkAuszugPart === 'yes' ? 'none' : 'auto'
}))`
  max-width: 768px;
  width: 100%;
  height: 100%;
  margin: ${(props) => props.margin};
  color: ${colors.black0};
  box-shadow: ${(props) => props.boxShadow};
  max-height: 100%;
  overflow: ${(props) => props.overflow};
  ${(props) =>
    props.isIkAuszugPart === 'yes'
      ? `${DropZoneStyled} {
    width: 100%;
  }
  ${ButtonWithIcon} {
    background-color: ${colors.blue1};
  }`
      : ''}
  @media ${device.tablet} {
    margin: 20px 10px;
    width: calc(100% - 20px);
  }
`;

export const ScanContent = styled.div`
  padding: 20px 0;
  background-color: ${colors.white0};
`;

export const DropzoneWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ExamplePicture = styled.img`
  width: 100%;
  object-fit: cover;
  margin: 10px 0;
  opacity: 0.7;
`;

const rotate = keyframes` {
  0% {transform: rotate(0deg); color: ${colors.blue1}; }
  50% {transform: rotate(180deg) scale(0.75); color: ${colors.green1}; }
  100% {transform: rotate(360deg); color: ${colors.blue1};}
}`;

const wave = keyframes`{
  0% {
    transform: rotate(0deg) ; color: ${colors.blue1}
  }
  25% {
    transform: rotate(-30deg); color: ${colors.green1}; 
  }
  75% {
    transform: rotate(60deg); color: ${colors.green1}; 
  }
  100% {
    transform: rotate(0deg);
    color: ${colors.blue1};
  }
}`;

const orbit = keyframes`{
  0% {transform: rotateY(0); color: ${colors.blue1}; }
  50% {transform: rotateY(360deg); color: ${colors.green1};}
  100% {transform: rotateY(0); color: ${colors.blue1};}
}`;

export const BigIcon = styled.i`
  margin: 30px 0;
  &:before {
    font-family: leinero;
    font-style: normal;
    color: inherit;
    font-size: 260px;
    height: auto;
    width: auto;
    line-height: 260px;
  }
  &.spinner {
    animation-name: ${rotate};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    &:before {
      content: '${icons.rocket}';
    }
  }
  &.searching {
    animation-name: ${orbit};
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    &:before {
      content: '${icons.search}';
    }
  }
  &.waiting {
    animation-name: ${wave};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    &:before {
      content: '${icons.smileWave}';
    }
  }
  &.error{
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 6px solid ${colors.red1};
    &:before {
      content: '${icons.hand1}';
      color: ${colors.red1};
    }
  }
  &.complete{
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 8px solid ${colors.blue1};
    &:before {
      content: '${icons.check}';
      color: ${colors.blue1};
    }
  }
`;
export const List = styled.ul``;

export const ListItem = styled.li`
  display: flex;
`;

export const ImagesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

export const ImgContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 250px;
  overflow: hidden;
  box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.4);

  @media ${device.tablet} {
    width: calc(50vw - 40px);
    height: calc(50vw - 40px);
  }
`;

export const Toolbar = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 40px;
  background: ${colors.grey0};
  justify-content: space-evenly;
  align-items: center;
  i:before {
    font-family: leinero;
    font-size: 32px;
    line-height: 40px;
    color: ${colors.white0};
    font-style: normal;
    cursor: pointer;
    &:hover {
      color: ${colors.white2};
    }
  }
  i.zoom:before {
    content: '${icons.zoomIn}';
  }
  i.seperator:before {
    content: '';
    font-size: 18px;
    border-left: 1px solid ${colors.grey2};
  }
  i.remove:before {
    content: '${icons.clear}';
  }
`;

export const RemoveIcon = styled.i`
  &:before {
    cursor: pointer;
    content: \'${icons.clear}\';
    font-family: leinero;
    position: absolute;
    top: 5px;
    right: 15px;
    font-style: normal;
    color: ${colors.black0};
    background: ${colors.white0};
    box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.4);
    height: 16px;
    font-size: 20px;
    line-height: 16px;
    border-radius: 50%;
    font-weight: bold;
    width: 16px;
    text-align: center;
  }
`;

export const ImportedImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ScanFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  @media ${device.tablet} {
    flex-direction: column;
    ${ButtonWithIcon} {
      margin: 5px 0;
      justify-content: center;
    }
  }
`;

export const OverflowContent = styled.div`
  overflow: auto;
  max-height: calc(var(--vh, 1vh) * 100);
  @media ${device.tablet} {
    max-height: calc(var(--vh, 1vh) * 100);
  }
`;

export const bgColor = '#18252D';

export const ScanWrapper = styled('div')`
  background-color: ${bgColor};
  width: auto;
  margin: 0 auto 10px;
  max-width: 760px;
`;

export const Counter = styled.span`
  display: inline-flex;
  background: ${colors.grey0};
  color: ${colors.white0};
  min-width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 4px;
  & + p {
    margin-top: 4px;
  }
`;

export const Filename = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 230px;
  display: inline-block;
`;
